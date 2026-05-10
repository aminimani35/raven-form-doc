import type { FieldValidation } from "../types";

/**
 * Build RHF `rules` object from a FieldValidation config.
 * Also handles async custom validators with debounce.
 */
export function buildRHFRules(
  validation: FieldValidation | undefined,
  getValues: () => Record<string, unknown>,
): Record<string, unknown> {
  if (!validation) return {};

  const rules: Record<string, unknown> = {};

  if (validation.required) {
    rules.required =
      typeof validation.required === "string"
        ? validation.required
        : "این فیلد الزامی است";
  }
  if (validation.min !== undefined) {
    rules.min = {
      value: validation.min,
      message: `حداقل مقدار ${validation.min} است`,
    };
  }
  if (validation.max !== undefined) {
    rules.max = {
      value: validation.max,
      message: `حداکثر مقدار ${validation.max} است`,
    };
  }
  if (validation.minLength !== undefined) {
    rules.minLength = {
      value: validation.minLength,
      message: `حداقل ${validation.minLength} کاراکتر وارد کنید`,
    };
  }
  if (validation.maxLength !== undefined) {
    rules.maxLength = {
      value: validation.maxLength,
      message: `حداکثر ${validation.maxLength} کاراکتر مجاز است`,
    };
  }
  if (validation.pattern) {
    rules.pattern = {
      value: validation.pattern,
      message: "فرمت وارد شده صحیح نیست",
    };
  }

  if (validation.custom || validation.asyncCustom) {
    rules.validate = async (value: unknown) => {
      if (validation.custom) {
        const err = validation.custom(value, getValues());
        if (err) return err;
      }
      if (validation.asyncCustom) {
        const err = await validation.asyncCustom(value, getValues());
        if (err) return err;
      }
      return true;
    };
  }

  return rules;
}

/** Normalize various error shapes to a plain string */
export function normalizeError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
  }
  return "خطا در این فیلد";
}
