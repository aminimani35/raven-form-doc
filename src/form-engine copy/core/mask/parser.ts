// ─── Raven Form — Mask Pattern Parser ────────────────────────────────────────
// Converts a mask pattern string into a structured slot array.
// Results are memoised per (pattern × serialised token keys) to ensure
// the parser only runs once per unique configuration.

import type { MaskSlot, MaskToken, MaskTokenMap, MaskOptions } from "./types";
import { DEFAULT_WILDCARD_TOKEN } from "./types";

// ─── Internal cache ───────────────────────────────────────────────────────────

const parseCache = new Map<string, MaskSlot[]>();

function cacheKey(pattern: string, tokenKeys: string[]): string {
  return pattern + "\0" + tokenKeys.sort().join(",");
}

// ─── Token resolution ─────────────────────────────────────────────────────────

/**
 * Merge caller-supplied tokens on top of the default `{ '*': any }` map.
 * Returns the resolved token map.
 */
export function resolveTokenMap(tokens?: MaskTokenMap): MaskTokenMap {
  return { "*": DEFAULT_WILDCARD_TOKEN, ...tokens };
}

// ─── Core parser ──────────────────────────────────────────────────────────────

/**
 * Parse a mask pattern string into an ordered array of {@link MaskSlot}s.
 *
 * Each character in the pattern is classified as either:
 * - **InputSlot** if its character key exists in `tokenMap`
 * - **LiteralSlot** otherwise
 *
 * The resulting array is **cached** — repeated calls with the same pattern +
 * identical token keys return the same array reference.
 *
 * @example
 * parsePattern("(***) ***-****")
 * // → [
 * //   { kind:'literal', char:'(', patternIndex:0 },
 * //   { kind:'input',   token: DEFAULT_WILDCARD_TOKEN, patternIndex:1 },
 * //   ...
 * // ]
 */
export function parsePattern(
  pattern: string,
  tokenMap: MaskTokenMap = { "*": DEFAULT_WILDCARD_TOKEN },
): MaskSlot[] {
  const key = cacheKey(pattern, Object.keys(tokenMap));
  const cached = parseCache.get(key);
  if (cached) return cached;

  const slots: MaskSlot[] = [];

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    const token: MaskToken | undefined = tokenMap[char];

    if (token) {
      slots.push({ kind: "input", token, patternIndex: i });
    } else {
      slots.push({ kind: "literal", char, patternIndex: i });
    }
  }

  parseCache.set(key, slots);
  return slots;
}

// ─── Slot helpers ─────────────────────────────────────────────────────────────

/** Return only the input slots from a parsed slot array. */
export function inputSlotsOf(
  slots: MaskSlot[],
): Array<MaskSlot & { kind: "input" }> {
  return slots.filter(
    (s): s is MaskSlot & { kind: "input" } => s.kind === "input",
  );
}

/** Count how many input slots a pattern has. */
export function inputSlotCount(
  pattern: string,
  tokenMap?: MaskTokenMap,
): number {
  return inputSlotsOf(parsePattern(pattern, resolveTokenMap(tokenMap))).length;
}

// ─── Options resolver ─────────────────────────────────────────────────────────

export interface ResolvedMaskOptions {
  pattern: string;
  tokenMap: MaskTokenMap;
  placeholder: string;
  autoFillLiterals: boolean;
  slots: MaskSlot[];
}

/**
 * Normalise a `string | MaskOptions` argument into a fully resolved config
 * object that includes the pre-parsed slot array.
 */
export function resolveOptions(
  opts: string | MaskOptions,
): ResolvedMaskOptions {
  const pattern = typeof opts === "string" ? opts : opts.pattern;
  const rawTokens = typeof opts === "string" ? undefined : opts.tokens;
  const placeholder =
    typeof opts === "string" ? "_" : (opts.placeholder ?? "_");
  const autoFillLiterals =
    typeof opts === "string" ? true : (opts.autoFillLiterals ?? true);

  const tokenMap = resolveTokenMap(rawTokens);
  const slots = parsePattern(pattern, tokenMap);

  return { pattern, tokenMap, placeholder, autoFillLiterals, slots };
}

/** Clear the internal parse cache (useful in tests). */
export function clearParseCache(): void {
  parseCache.clear();
}
