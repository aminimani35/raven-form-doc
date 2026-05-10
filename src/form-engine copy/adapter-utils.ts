// ─── Raven Form — Adapter Authoring Utilities ─────────────────────────────────
//
// These utilities give adapter authors a typed, validated entry-point for
// creating UIAdapter and FormAdapter objects.  They mirror the TanStack /
// Radix philosophy: the library defines contracts; consumers bring their own
// implementations.
//
// Usage:
//   import { createUIAdapter, createFormAdapter } from "raven-form-engine";

import type { UIAdapter, FormAdapter, FieldType } from "./types";

// ─── createUIAdapter ──────────────────────────────────────────────────────────

/**
 * Creates a UIAdapter from a configuration object.
 *
 * Runs validation in development mode and returns the adapter unchanged so
 * TypeScript retains exact component types.
 *
 * @example
 * ```tsx
 * import { createUIAdapter } from "raven-form-engine";
 *
 * const myUIAdapter = createUIAdapter({
 *   components: {
 *     text:      MyInput,
 *     textarea:  MyTextarea,
 *     select:    MySelect,
 *     checkbox:  MyCheckbox,
 *     switch:    MySwitch,
 *   },
 *   FormItem: MyFormItem,
 *   inlineTypes: ["checkbox", "switch"],
 *   fallback: MyFallbackInput,
 * });
 * ```
 */
export function createUIAdapter(definition: UIAdapter): UIAdapter {
  validateUIAdapter(definition);
  return definition;
}

// ─── createFormAdapter ────────────────────────────────────────────────────────

/**
 * Creates a FormAdapter from a configuration object.
 *
 * Runs validation in development mode and returns the adapter unchanged.
 *
 * @example
 * ```tsx
 * import { createFormAdapter } from "raven-form-engine";
 * // Using React Hook Form internally:
 *
 * const rhfAdapter = createFormAdapter({
 *   Provider: RHFProvider,              // wraps <form> + FormProvider
 *   useField: (name) => { ... },        // maps to useController
 *   useSubmit: () => { ... },           // calls form.handleSubmit
 *   useWatch: (names?) => { ... },      // maps to useWatch
 *   useTrigger: () => trigger,          // optional: maps to trigger()
 * });
 * ```
 */
export function createFormAdapter(definition: FormAdapter): FormAdapter {
  validateFormAdapter(definition);
  return definition;
}

// ─── Runtime validation ───────────────────────────────────────────────────────

/** Field types whose absence generates a development-mode warning. */
const RECOMMENDED_UI_TYPES: FieldType[] = [
  "text",
  "textarea",
  "select",
  "checkbox",
];

/** Required keys on every FormAdapter. */
const REQUIRED_FORM_ADAPTER_KEYS = [
  "Provider",
  "useField",
  "useSubmit",
  "useWatch",
] as const;

/**
 * Validates a UIAdapter object in development mode.
 * Logs descriptive errors / warnings to the console when issues are detected.
 *
 * Called automatically by {@link createUIAdapter}.
 */
export function validateUIAdapter(adapter: UIAdapter): void {
  if (!adapter || typeof adapter !== "object") {
    console.error(
      "[RavenForm] createUIAdapter: received a non-object value. " +
        "Pass a UIAdapter configuration object.",
    );
    return;
  }

  if (!adapter.components || typeof adapter.components !== "object") {
    console.error(
      "[RavenForm] createUIAdapter: missing required `components` map.\n" +
        "  Provide at least: { text: MyInputComponent }\n" +
        "  See: https://github.com/aminimani35/raven-form#ui-adapter",
    );
    return;
  }

  // Warn about missing recommended types
  const missing = RECOMMENDED_UI_TYPES.filter((t) => !adapter.components[t]);
  if (missing.length > 0) {
    if (!adapter.fallback) {
      console.warn(
        `[RavenForm] UIAdapter: no components registered for [${missing.join(", ")}] ` +
          `and no fallback provided. Those fields will be silently skipped.\n` +
          `  → Register them: components: { ${missing[0]}: YourComponent, ... }\n` +
          `  → Or add a fallback: fallback: YourFallbackComponent`,
      );
    }
  }
}

/**
 * Validates a FormAdapter object in development mode.
 * Called automatically by {@link createFormAdapter}.
 */
export function validateFormAdapter(adapter: FormAdapter): void {
  if (!adapter || typeof adapter !== "object") {
    console.error(
      "[RavenForm] createFormAdapter: received a non-object value.",
    );
    return;
  }

  for (const key of REQUIRED_FORM_ADAPTER_KEYS) {
    if (!adapter[key]) {
      console.error(
        `[RavenForm] createFormAdapter: missing required key "${key}".\n` +
          `  Every FormAdapter must implement: ${REQUIRED_FORM_ADAPTER_KEYS.join(", ")}\n` +
          `  See: https://github.com/aminimani35/raven-form#form-adapter`,
      );
    }
  }

  if (adapter.useField && typeof adapter.useField !== "function") {
    console.error(
      "[RavenForm] createFormAdapter: `useField` must be a function " +
        "that accepts a field name string and returns a FieldBinding.",
    );
  }

  if (adapter.useWatch && typeof adapter.useWatch !== "function") {
    console.error(
      "[RavenForm] createFormAdapter: `useWatch` must be a function " +
        "that returns an object of current form values.",
    );
  }
}
