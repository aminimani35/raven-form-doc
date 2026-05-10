// ─── Raven Form — Mask Engine Public API ─────────────────────────────────────
//
// Import paths:
//   import { applyMask, removeMask, ... } from "raven-form-engine/core/mask"
//   import { useMask } from "raven-form-engine/core/mask"
//
// Sub-module imports (tree-shakable):
//   import { parsePattern } from "raven-form-engine/core/mask/parser"
//   import { applyMask }    from "raven-form-engine/core/mask/engine"
//   import { useMask }      from "raven-form-engine/core/mask/hooks"

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  MaskToken,
  MaskTokenMap,
  MaskOptions,
  InputSlot,
  LiteralSlot,
  MaskSlot,
  MaskResult,
  MaskMutationResult,
} from "./types";

export {
  DEFAULT_WILDCARD_TOKEN,
  DIGIT_TOKEN,
  ALPHA_UPPER_TOKEN,
  ALPHA_LOWER_TOKEN,
  ALPHANUM_TOKEN,
  BUILTIN_TOKENS,
} from "./types";

// ─── Parser ───────────────────────────────────────────────────────────────────
export {
  parsePattern,
  resolveOptions,
  resolveTokenMap,
  inputSlotsOf,
  inputSlotCount,
  clearParseCache,
} from "./parser";

// ─── Engine (pure, SSR-safe) ──────────────────────────────────────────────────
export {
  applyMask,
  removeMask,
  isMaskComplete,
  insertChar,
  handleBackspace,
  handleDelete,
  handlePaste,
  processInputChange,
  clearRange,
} from "./engine";

// ─── React hook ───────────────────────────────────────────────────────────────
export { useMask } from "./hooks";
export type { UseMaskOptions, UseMaskResult } from "./hooks";
