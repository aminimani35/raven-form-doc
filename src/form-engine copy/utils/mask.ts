// ─── Raven Form — Mask Utilities (compatibility + legacy named masks) ─────────
// Re-exports the new pattern-based mask engine for backward compatibility.
// New code should prefer: import { applyMask, removeMask, useMask } from '../core/mask'

export {
  applyMask,
  removeMask,
  isMaskComplete,
  handlePaste,
  processInputChange,
  BUILTIN_TOKENS,
  DEFAULT_WILDCARD_TOKEN,
  DIGIT_TOKEN,
  ALPHA_UPPER_TOKEN,
  ALPHA_LOWER_TOKEN,
  ALPHANUM_TOKEN,
} from "../core/mask";

export type {
  MaskToken,
  MaskTokenMap,
  MaskOptions,
  MaskResult,
  MaskMutationResult,
} from "../core/mask";

// ─── Legacy Named Masks ───────────────────────────────────────────────────────
import { applyMask as _apply } from "../core/mask";

export function maskPhone(value: string): string {
  return _apply(value, { pattern: "**** *** ****", placeholder: "" }).masked;
}

/** Bank card: 1234 5678 9012 3456 */
export function maskBankCard(value: string): string {
  return _apply(value, { pattern: "**** **** **** ****", placeholder: "" })
    .masked;
}

/** Currency with thousand separators */
export function maskCurrency(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("fa-IR");
}

/** National code — 10 digits, no separator */
export function maskNationalCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

/** Postal code: 12345-67890 */
export function maskPostalCode(value: string): string {
  return _apply(value, { pattern: "*****-*****", placeholder: "" }).masked;
}

/** IBAN: IR + 24 digits, grouped in 4s */
export function maskIBAN(value: string): string {
  const clean = value
    .replace(/[^IR\d]/gi, "")
    .toUpperCase()
    .slice(0, 26);
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

/** OTP: digits only, max 6 */
export function maskOTP(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export const maskRegistry: Record<string, (value: string) => string> = {
  phone: maskPhone,
  bankCard: maskBankCard,
  currency: maskCurrency,
  nationalCode: maskNationalCode,
  postalCode: maskPostalCode,
  iban: maskIBAN,
  otp: maskOTP,
};
