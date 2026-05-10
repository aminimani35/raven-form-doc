// ─── Raven Form — Pattern Mask Engine ────────────────────────────────────────
// A fully user-defined, pattern-based masking engine.
//
// Design:
//   • `*` is the default wildcard input token (accepts any character)
//   • Every other character in the pattern is a literal separator
//   • The token map is extensible: consumers can register custom tokens
//     (e.g. `#` = digit only, `A` = alpha only, `9` = digit with transform)

// ─── Token ────────────────────────────────────────────────────────────────────

/**
 * A mask token defines a single input-slot type within a pattern.
 *
 * @example
 * // Accept digits only
 * const digitToken: MaskToken = {
 *   char: '#',
 *   test: /^\d$/,
 * }
 *
 * @example
 * // Accept uppercase alpha only, auto-uppercase input
 * const alphaUpperToken: MaskToken = {
 *   char: 'A',
 *   test: /^[a-zA-Z]$/,
 *   transform: (c) => c.toUpperCase(),
 * }
 */
export interface MaskToken {
  /** The single character used to represent this token in the mask pattern. */
  char: string;

  /**
   * Validator for an input character.
   * Can be a RegExp (tested against the single char) or a predicate function.
   *
   * RegExp will be tested with `.test(char)` — always supply a pattern that
   * matches a SINGLE character (no anchors needed; the engine tests one char
   * at a time).
   */
  test: RegExp | ((char: string) => boolean);

  /**
   * Optional transform applied to the character after validation.
   * Useful for case coercion, digit remapping, etc.
   */
  transform?: (char: string) => string;

  /**
   * Human-readable description used in error messages / documentation.
   */
  description?: string;
}

/** Map from pattern character → token definition. */
export type MaskTokenMap = Record<string, MaskToken>;

// ─── Built-in Default Tokens ──────────────────────────────────────────────────

/**
 * The built-in wildcard token used when no custom token map is provided.
 * `*` accepts any single non-empty character.
 */
export const DEFAULT_WILDCARD_TOKEN: MaskToken = {
  char: "*",
  test: /[\s\S]/, // accepts any single char including unicode
  description: "Any character",
};

/**
 * Built-in token: `#` — digits 0–9 only.
 * Available through {@link BUILTIN_TOKENS}.
 */
export const DIGIT_TOKEN: MaskToken = {
  char: "#",
  test: /^\d$/,
  description: "Digit (0–9)",
};

/**
 * Built-in token: `A` — alphabetic characters, auto-uppercased.
 * Available through {@link BUILTIN_TOKENS}.
 */
export const ALPHA_UPPER_TOKEN: MaskToken = {
  char: "A",
  test: /^[a-zA-Z]$/,
  transform: (c) => c.toUpperCase(),
  description: "Uppercase letter",
};

/**
 * Built-in token: `a` — alphabetic characters, auto-lowercased.
 * Available through {@link BUILTIN_TOKENS}.
 */
export const ALPHA_LOWER_TOKEN: MaskToken = {
  char: "a",
  test: /^[a-zA-Z]$/,
  transform: (c) => c.toLowerCase(),
  description: "Lowercase letter",
};

/**
 * Built-in token: `X` — alphanumeric characters, auto-uppercased.
 * Available through {@link BUILTIN_TOKENS}.
 */
export const ALPHANUM_TOKEN: MaskToken = {
  char: "X",
  test: /^[a-zA-Z0-9]$/,
  transform: (c) => c.toUpperCase(),
  description: "Alphanumeric (uppercase)",
};

/**
 * All built-in tokens. Pass to `MaskOptions.tokens` to include them
 * alongside (or instead of) the default `*` wildcard.
 */
export const BUILTIN_TOKENS: MaskTokenMap = {
  "*": DEFAULT_WILDCARD_TOKEN,
  "#": DIGIT_TOKEN,
  A: ALPHA_UPPER_TOKEN,
  a: ALPHA_LOWER_TOKEN,
  X: ALPHANUM_TOKEN,
};

// ─── Mask Options ─────────────────────────────────────────────────────────────

/**
 * Configuration for a mask operation.
 *
 * @example
 * // Simple string shorthand — uses '*' wildcard, '_' placeholder
 * const opts = "****-****-**-**";
 *
 * @example
 * // Full options object
 * const opts: MaskOptions = {
 *   pattern: "####-####-##-##",
 *   tokens: BUILTIN_TOKENS,
 *   placeholder: '·',
 * }
 */
export interface MaskOptions {
  /**
   * The mask pattern.
   *
   * Each character is either:
   * - An **input slot**: defined by a token key in `tokens` (default: `*`)
   * - A **literal separator**: anything else (space, dash, dot, parens, etc.)
   *
   * @example "****-****-**-**"   // bank-card-style
   * @example "(***) ***-****"    // US phone
   * @example "## / ## / ####"   // date DD/MM/YYYY
   */
  pattern: string;

  /**
   * Token map for this mask. Keys are single characters used in the pattern.
   * Merged on top of the built-in `{ '*': any }` default.
   *
   * @example
   * tokens: { '#': DIGIT_TOKEN, 'A': ALPHA_UPPER_TOKEN }
   */
  tokens?: MaskTokenMap;

  /**
   * Character displayed in unfilled input slots. Default: `'_'`.
   * Set to `''` to show nothing (floating/shrink-label style inputs).
   */
  placeholder?: string;

  /**
   * If true, literal separators are automatically inserted as the user types
   * past them. Default: `true`.
   */
  autoFillLiterals?: boolean;
}

// ─── Parsed Slot Types ────────────────────────────────────────────────────────

/** A position in the parsed mask that accepts user input. */
export interface InputSlot {
  kind: "input";
  /** The token that governs what characters are accepted here. */
  token: MaskToken;
  /** Zero-based index of this slot in the full mask pattern string. */
  patternIndex: number;
}

/** A position in the parsed mask that is a fixed literal character. */
export interface LiteralSlot {
  kind: "literal";
  /** The exact character at this position. */
  char: string;
  /** Zero-based index of this slot in the full mask pattern string. */
  patternIndex: number;
}

export type MaskSlot = InputSlot | LiteralSlot;

// ─── Operation Results ────────────────────────────────────────────────────────

/**
 * The result of any mask engine operation.
 */
export interface MaskResult {
  /**
   * The full masked string, including literals and placeholders for any
   * unfilled input slots.
   */
  masked: string;

  /**
   * The raw user input — only the characters that filled input slots,
   * in order. No literals, no placeholders.
   */
  raw: string;

  /** True when every input slot in the mask has been filled. */
  complete: boolean;

  /**
   * The recommended cursor position after this operation, as a character
   * offset within `masked`.
   */
  cursor: number;
}

export interface MaskMutationResult {
  /** The new masked string after the mutation. */
  value: string;
  /** The recommended cursor position after the mutation. */
  cursor: number;
}
