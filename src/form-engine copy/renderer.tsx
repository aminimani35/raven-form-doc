"use client";

// ─── Raven Form — Dynamic Field Rendering Pipeline ────────────────────────────
//
// This module is the core of the headless rendering engine.  It decouples
// field.type from concrete components by performing a runtime lookup against
// the UIAdapter component registry.
//
// No UI framework is imported here — the renderer is completely agnostic to
// whether the consumer is using Ant Design, MUI, ShadCN, Chakra, custom HTML,
// or something entirely bespoke.

import type { ComponentType } from "react";
import type { FieldType, UIAdapter, UIFieldProps, FormField } from "./types";

// ─── Text-family field types ──────────────────────────────────────────────────
// These types all share a common "text input" component; if the adapter
// does not register an exact match for (e.g.) "email", the engine falls
// back to ui.components["text"] and passes type="email" as a prop.

const TEXT_FAMILY: ReadonlySet<string> = new Set<FieldType>([
  "text",
  "email",
  "tel",
  "url",
  "number",
  "password",
  "time",
  "datetime",
]);

// HTML `type` attribute injected for text-family types
const FIELD_TO_INPUT_TYPE: Partial<Record<FieldType, string>> = {
  email: "email",
  tel: "tel",
  url: "url",
  number: "number",
  password: "password",
  time: "time",
  datetime: "datetime-local",
};

// ─── resolveFieldComponent ────────────────────────────────────────────────────

/**
 * Resolves the React component for a given field type from the UIAdapter registry.
 *
 * Resolution order:
 *  1. `ui.components[fieldType]`     — exact registration
 *  2. `ui.components["text"]`        — text-family fallback (email/tel/url/number/…)
 *  3. `ui.fallback`                  — catch-all provided by the adapter author
 *  4. `null`                         — nothing registered (dev warning emitted)
 *
 * @example
 * const Comp = resolveFieldComponent("email", myUIAdapter);
 * // → ui.components["email"] ?? ui.components["text"] ?? ui.fallback ?? null
 */
export function resolveFieldComponent(
  fieldType: FieldType | string,
  ui: UIAdapter,
): ComponentType<UIFieldProps> | null {
  // 1. Exact match
  const exact = ui.components[fieldType];
  if (exact) return exact;

  // 2. Text-family fallback
  if (TEXT_FAMILY.has(fieldType)) {
    const textComp = ui.components["text"];
    if (textComp) return textComp;
  }

  // 3. Catch-all fallback
  if (ui.fallback) return ui.fallback;

  // 4. Nothing — dev warning
  console.warn(
    `[RavenForm] No component registered in UIAdapter for field type "${fieldType}". ` +
      `Add it to ui.components["${fieldType}"] or provide a ui.fallback component.`,
  );

  return null;
}

// ─── buildFieldProps ──────────────────────────────────────────────────────────

/**
 * Constructs the standard UIFieldProps object passed to every field component.
 *
 * Handles:
 * - Injecting the correct HTML `type` attribute for text-family fields
 * - Spreading field.componentProps for per-field customisation
 * - Forwarding options for select / radio / multiselect
 */
export function buildFieldProps(
  field: FormField,
  opts: {
    value: unknown;
    onChange: (v: unknown) => void;
    onBlur: () => void;
    error?: string;
    disabled?: boolean;
  },
): UIFieldProps {
  const inputType = FIELD_TO_INPUT_TYPE[field.type as FieldType];

  return {
    id: field.name,
    name: field.name,
    value: opts.value,
    onChange: opts.onChange,
    onBlur: opts.onBlur,
    error: opts.error,
    disabled: opts.disabled ?? false,
    placeholder: field.placeholder,
    label: field.label,
    // Inject HTML type for text-family fields (email → type="email", etc.)
    ...(inputType !== undefined ? { type: inputType } : {}),
    // Forward select/radio/multiselect options
    ...(field.options !== undefined ? { options: field.options } : {}),
    // Forward per-field extra props last so they can override anything above
    ...(field.componentProps ?? {}),
  };
}

// ─── isInlineType ─────────────────────────────────────────────────────────────

/**
 * Returns true when a field type should render inline — i.e. skip FormItem
 * wrapping (no separate label/error chrome rendered by the adapter's FormItem).
 *
 * Defaults to `["checkbox", "switch"]`; override via `ui.inlineTypes`.
 */
export function isInlineType(
  fieldType: FieldType | string,
  ui: UIAdapter,
): boolean {
  const inlineTypes: Array<string> = ui.inlineTypes ?? ["checkbox", "switch"];
  return inlineTypes.includes(fieldType);
}
