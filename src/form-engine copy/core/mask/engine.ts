// ─── Raven Form — Mask Engine ─────────────────────────────────────────────────
// Pure, deterministic core operations:
//   applyMask  — raw string → masked string + metadata
//   removeMask — masked string → raw string
//   isMaskComplete — is every input slot filled?
//   insertChar — cursor-safe single-char insertion
//   handleBackspace — cursor-safe deletion
//   handlePaste — paste handling (strips literals, maps valid chars)
//
// All functions are framework-agnostic (no React imports) and SSR-safe.

import type { MaskResult, MaskMutationResult, MaskOptions } from "./types";
import { resolveOptions, inputSlotsOf } from "./parser";

// Re-export so callers can import everything from "core/mask/engine"
export type { MaskResult, MaskOptions };

// ─── applyMask ────────────────────────────────────────────────────────────────

/**
 * Apply a mask pattern to a raw string.
 *
 * The engine:
 * 1. Iterates over each slot in the parsed pattern.
 * 2. For input slots — consumes the next **valid** character from `raw`,
 *    applies the token transform, and emits it.
 * 3. For literal slots — emits the literal character directly.
 * 4. Any remaining unfilled input slots are filled with `placeholder`.
 *
 * Invalid characters in `raw` are **silently skipped** (they don't
 * consume a slot).
 *
 * @param raw     The raw user input (may contain only content chars, or
 *                may itself be a previously masked string — removeMask is
 *                called internally for robustness).
 * @param opts    Mask pattern string or full {@link MaskOptions}.
 * @returns       {@link MaskResult} with `masked`, `raw`, `complete`, `cursor`.
 *
 * @example
 * applyMask("1234567890", "(***) ***-****")
 * // { masked: "(123) 456-7890", raw: "1234567890", complete: true, cursor: 14 }
 *
 * @example
 * applyMask("12345", "****-****-**-**")
 * // { masked: "1234-5___-__-__", raw: "12345", complete: false, cursor: 7 }
 */
export function applyMask(raw: string, opts: string | MaskOptions): MaskResult {
  const { slots, placeholder } = resolveOptions(opts);

  let rawIdx = 0;
  let maskedStr = "";
  let rawOut = "";
  let cursor = 0;
  let startedInput = false;

  for (const slot of slots) {
    if (slot.kind === "literal") {
      maskedStr += slot.char;
      // Auto-advance cursor past literals only after the first input char
      if (startedInput) {
        cursor = maskedStr.length;
      }
    } else {
      // Input slot — find next valid char in raw
      let filled = false;
      while (rawIdx < raw.length) {
        const char = raw[rawIdx++];
        const accepts =
          typeof slot.token.test === "function"
            ? slot.token.test(char)
            : slot.token.test.test(char);

        if (accepts) {
          const out = slot.token.transform ? slot.token.transform(char) : char;
          maskedStr += out;
          rawOut += out;
          cursor = maskedStr.length;
          startedInput = true;
          filled = true;
          break;
        }
        // Invalid char — skip silently
      }

      if (!filled) {
        maskedStr += placeholder;
      }
    }
  }

  const inputSlotCount = inputSlotsOf(slots).length;

  return {
    masked: maskedStr,
    raw: rawOut,
    complete: rawOut.length === inputSlotCount,
    cursor,
  };
}

// ─── removeMask ───────────────────────────────────────────────────────────────

/**
 * Extract the raw (unmasked) value from a masked string.
 *
 * Iterates over each slot in the pattern. For input slots, if the
 * character at that position exists and is not the placeholder, it is
 * included in the output.
 *
 * @example
 * removeMask("(123) 456-7890", "(***) ***-****")
 * // "1234567890"
 *
 * @example
 * removeMask("1234-5___-__-__", "****-****-**-**")
 * // "12345"
 */
export function removeMask(masked: string, opts: string | MaskOptions): string {
  const { slots, placeholder } = resolveOptions(opts);

  let raw = "";
  for (let i = 0; i < slots.length && i < masked.length; i++) {
    const slot = slots[i];
    if (slot.kind === "input") {
      const char = masked[i];
      if (char && char !== placeholder) {
        raw += char;
      }
    }
  }
  return raw;
}

// ─── isMaskComplete ───────────────────────────────────────────────────────────

/**
 * Return `true` if every input slot in the mask is filled (non-placeholder).
 *
 * @example
 * isMaskComplete("(123) 456-7890", "(***) ***-****") // true
 * isMaskComplete("(123) 456-____", "(***) ***-****") // false
 */
export function isMaskComplete(
  masked: string,
  opts: string | MaskOptions,
): boolean {
  const { slots, placeholder } = resolveOptions(opts);

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot.kind === "input") {
      if (!masked[i] || masked[i] === placeholder) return false;
    }
  }
  return true;
}

// ─── insertChar ───────────────────────────────────────────────────────────────

/**
 * Insert a single character at the given cursor position within a masked string.
 *
 * The engine:
 * 1. Finds the first **input slot** at or after `cursor`.
 * 2. Validates the character against that slot's token.
 * 3. Fills the slot, then skips forward past any immediately following literal
 *    slots (auto-fill) to place the cursor at the next input slot.
 *
 * If the character is invalid for the slot, the masked string and cursor are
 * returned unchanged.
 *
 * @param char    The single character to insert.
 * @param masked  The current masked string (may contain placeholders).
 * @param cursor  The current cursor position (character offset in `masked`).
 * @param opts    Mask pattern or options.
 *
 * @example
 * insertChar("5", "1234-____-__-__", 5, "****-****-**-**")
 * // { value: "1234-5___-__-__", cursor: 6 }
 */
export function insertChar(
  char: string,
  masked: string,
  cursor: number,
  opts: string | MaskOptions,
): MaskMutationResult {
  const { slots, placeholder } = resolveOptions(opts);

  // Find the next input slot at or after cursor position
  let slotIdx = cursor;
  while (slotIdx < slots.length && slots[slotIdx].kind === "literal") {
    slotIdx++;
  }

  if (slotIdx >= slots.length) return { value: masked, cursor };

  const slot = slots[slotIdx];
  if (slot.kind !== "input") return { value: masked, cursor };

  // Validate char against the slot's token
  const accepts =
    typeof slot.token.test === "function"
      ? slot.token.test(char)
      : slot.token.test.test(char);

  if (!accepts) return { value: masked, cursor };

  const transformed = slot.token.transform ? slot.token.transform(char) : char;

  // Rebuild masked array with this slot filled
  const arr = masked.padEnd(slots.length, placeholder).split("");
  arr[slotIdx] = transformed;
  const newMasked = arr.join("").slice(0, slots.length);

  // Advance cursor: skip past the filled slot + any following literals
  let newCursor = slotIdx + 1;
  while (newCursor < slots.length && slots[newCursor].kind === "literal") {
    newCursor++;
  }

  return { value: newMasked, cursor: newCursor };
}

// ─── handleBackspace ─────────────────────────────────────────────────────────

/**
 * Handle a Backspace key press at the given cursor position.
 *
 * The engine:
 * 1. Looks *backwards* from `cursor` for the nearest filled input slot.
 * 2. Clears that slot (replaces with placeholder).
 * 3. Shifts the cursor back to that slot index.
 *
 * Pressing Backspace in a field with the cursor before the first input slot
 * is a no-op.
 *
 * @example
 * handleBackspace("1234-5___-__-__", 6, "****-****-**-**")
 * // { value: "1234-____-__-__", cursor: 5 }
 */
export function handleBackspace(
  masked: string,
  cursor: number,
  opts: string | MaskOptions,
): MaskMutationResult {
  const { slots, placeholder } = resolveOptions(opts);

  if (cursor === 0) return { value: masked, cursor: 0 };

  // Walk backwards from cursor - 1 to find the nearest input slot
  let slotIdx = cursor - 1;
  while (slotIdx >= 0 && slots[slotIdx].kind === "literal") {
    slotIdx--;
  }

  if (slotIdx < 0) return { value: masked, cursor: 0 };

  const arr = masked.padEnd(slots.length, placeholder).split("");
  arr[slotIdx] = placeholder;

  return { value: arr.join("").slice(0, slots.length), cursor: slotIdx };
}

// ─── handleDelete ─────────────────────────────────────────────────────────────

/**
 * Handle a Delete key press (forward delete) at the given cursor position.
 *
 * Clears the input slot at or after `cursor`, leaving the cursor in place.
 */
export function handleDelete(
  masked: string,
  cursor: number,
  opts: string | MaskOptions,
): MaskMutationResult {
  const { slots, placeholder } = resolveOptions(opts);

  let slotIdx = cursor;
  while (slotIdx < slots.length && slots[slotIdx].kind === "literal") {
    slotIdx++;
  }

  if (slotIdx >= slots.length) return { value: masked, cursor };

  const arr = masked.padEnd(slots.length, placeholder).split("");
  arr[slotIdx] = placeholder;

  return { value: arr.join("").slice(0, slots.length), cursor };
}

// ─── handlePaste ─────────────────────────────────────────────────────────────

/**
 * Handle a paste event — extract valid characters from arbitrary pasted text
 * and apply the mask from the beginning.
 *
 * Literal characters from the pasted string that match the mask's literal
 * separators are transparently skipped so that pasting an already-formatted
 * string (e.g. `"(123) 456-7890"`) works correctly.
 *
 * @example
 * handlePaste("(123) 456-7890", "(***) ***-****")
 * // { masked: "(123) 456-7890", raw: "1234567890", complete: true, cursor: 14 }
 *
 * @example
 * handlePaste("1234567890", "(***) ***-****")
 * // { masked: "(123) 456-7890", raw: "1234567890", complete: true, cursor: 14 }
 */
export function handlePaste(
  pasted: string,
  opts: string | MaskOptions,
): MaskResult {
  // Strip mask literals from the pasted string to get a raw candidate
  const { slots } = resolveOptions(opts);
  const inputSlots = inputSlotsOf(slots);

  let rawChars = "";
  let pasteIdx = 0;

  for (const slot of inputSlots) {
    // Consume paste chars until we find one that satisfies this slot
    while (pasteIdx < pasted.length) {
      const char = pasted[pasteIdx++];

      const accepts =
        typeof slot.token.test === "function"
          ? slot.token.test(char)
          : slot.token.test.test(char);

      if (accepts) {
        rawChars += slot.token.transform ? slot.token.transform(char) : char;
        break;
      }
      // Invalid char or separator — skip
    }
    if (pasteIdx >= pasted.length) break;
  }

  return applyMask(rawChars, opts);
}

// ─── Selection range helpers ──────────────────────────────────────────────────

/**
 * Given a selection range `[start, end]` in the masked string, clear all
 * input slots within that range.
 *
 * Useful for handling "replace selection" scenarios (type-over).
 */
export function clearRange(
  masked: string,
  selStart: number,
  selEnd: number,
  opts: string | MaskOptions,
): MaskMutationResult {
  const { slots, placeholder } = resolveOptions(opts);
  const arr = masked.padEnd(slots.length, placeholder).split("");

  for (let i = selStart; i < selEnd && i < slots.length; i++) {
    if (slots[i].kind === "input") {
      arr[i] = placeholder;
    }
  }

  return { value: arr.join("").slice(0, slots.length), cursor: selStart };
}

// ─── Type re-export for MaskMutationResult ────────────────────────────────────

// This lives in types.ts; we re-export here so engine consumers only need one import.
export type { MaskMutationResult } from "./types";

// ─── Conveniences ─────────────────────────────────────────────────────────────

/**
 * Fully process an `<input>` onChange event, handling:
 * - Normal character typing
 * - Cut/drag-drop (value becomes shorter)
 * - IME composition (value is a multi-char string)
 *
 * Works by extracting the raw from the new input value and re-applying the mask.
 * For fine-grained cursor control (no cursor jumping), prefer {@link insertChar}
 * and {@link handleBackspace} driven by keydown listeners.
 *
 * @param newInputValue    The string currently inside `<input>.value`
 * @param opts             Mask pattern or options
 */
export function processInputChange(
  newInputValue: string,
  opts: string | MaskOptions,
): MaskResult {
  const raw = removeMask(newInputValue, opts);
  return applyMask(raw, opts);
}
