import type { ComponentType, ReactNode } from "react";

// ─── Field Types ──────────────────────────────────────────────────────────────
export type FieldType =
  // ── Basic text inputs
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "password"
  // ── Multi-line & rich
  | "textarea"
  // ── Date / time
  | "date"
  | "time"
  | "datetime"
  // ── Selection
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  // ── Toggle
  | "switch"
  // ── Special
  | "otp"
  | "file"
  | "range"
  | "color"
  | "rating"
  // ── Compound / layout
  | "repeater"
  // ── Escape hatch
  | "custom";

// ─── Repeater Config ──────────────────────────────────────────────────────────
export interface RepeaterConfig {
  /** Sub-fields rendered per row */
  fields: FormField[];
  minRows?: number;
  maxRows?: number;
  addLabel?: string;
  removeLabel?: string;
  /** Default values for each new row */
  defaultRow?: Record<string, unknown>;
}

// ─── Wizard Step ──────────────────────────────────────────────────────────────
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  fields: FormField[];
  /** Optional grid columns override for this step (default 12) */
  columns?: number;
}

// ─── Validation ───────────────────────────────────────────────────────────────
export interface FieldValidation<T = unknown> {
  required?: boolean | string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T, formValues: Record<string, unknown>) => string | null;
  asyncCustom?: (
    value: T,
    formValues: Record<string, unknown>,
  ) => Promise<string | null>;
}

// ─── Render Context ────────────────────────────────────────────────────────────
export interface FieldRenderContext {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

// ─── Field Binding ─────────────────────────────────────────────────────────────
export interface FieldBinding {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  isDirty?: boolean;
  isTouched?: boolean;
}

// ─── Form Field Schema ─────────────────────────────────────────────────────────
export interface FormField<T = unknown> {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: T;
  disabled?: boolean | ((formValues: Record<string, unknown>) => boolean);
  hidden?: boolean | ((formValues: Record<string, unknown>) => boolean);
  validation?: FieldValidation<T>;
  /** Input masking function applied on change */
  mask?: (value: string) => string;
  /** Transform value before storing */
  formatter?: (value: T) => unknown;
  /** Transform stored value back to display */
  parser?: (value: unknown) => T;
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  /** 1-12 column span in the 12-column grid */
  colSpan?: number;
  /** Watch other field names to trigger re-evaluation of hidden/disabled */
  dependsOn?: string[];
  /** Custom render override */
  render?: (context: FieldRenderContext) => ReactNode;
  /** Extra props forwarded to the underlying UI component */
  componentProps?: Record<string, unknown>;
  /** Config for "repeater" type fields */
  repeaterConfig?: RepeaterConfig;
}

// ─── Form Schema ───────────────────────────────────────────────────────────────
export interface FormSchema {
  fields: FormField[];
  /** Number of grid columns (default 12) */
  columns?: number;
  /** Gap class e.g. "gap-4" */
  gap?: string;
  /** Wizard steps — if provided, RavenWizardForm renders step-by-step */
  steps?: WizardStep[];
}

// ─── Form Adapter ──────────────────────────────────────────────────────────────

/**
 * Props received by the FormAdapter's Provider component.
 *
 * The Raven core resolves defaultValues (merging schema-level defaults with
 * user-supplied defaults) BEFORE passing them here, so the adapter never needs
 * to know about FormSchema.
 */
export interface FormAdapterProviderProps {
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  children: ReactNode;
  /** Pre-merged default values from schema.fields[].defaultValue + user overrides */
  defaultValues?: Record<string, unknown>;
}

/**
 * Contract every FormAdapter must satisfy.
 *
 * Implement this interface to wire any form-state library (React Hook Form,
 * Formik, Zustand, Jotai, etc.) into the Raven engine.
 *
 * @example
 * const myFormAdapter = createFormAdapter({
 *   Provider: MyFormProvider,
 *   useField: (name) => ({ value, onChange, onBlur, error }),
 *   useSubmit: () => () => formRef.current?.submit(),
 *   useWatch: (names?) => ({ field1: value1, ... }),
 * });
 */
export interface FormAdapter {
  /** Wraps the form tree; must call onSubmit when the form is submitted. */
  Provider: ComponentType<FormAdapterProviderProps>;
  /** Returns binding for a single field by name. */
  useField: (name: string) => FieldBinding;
  /** Returns a function that triggers form submission. */
  useSubmit: () => () => void;
  /** Returns a snapshot of current form values (optionally filtered by names). */
  useWatch: (names?: string[]) => Record<string, unknown>;
  /**
   * Optional: trigger validation for specific field names and return whether
   * all pass. Used by RavenWizardForm to gate step advancement.
   */
  useTrigger?: () => (names: string[]) => Promise<boolean>;
}

// ─── UI Adapter ────────────────────────────────────────────────────────────────

/**
 * Universal props passed to every field component in the UIAdapter registry.
 *
 * Component authors must accept at minimum: value, onChange, onBlur.
 * All other props are optional. Unknown extras are forwarded via the index signature
 * so field.componentProps always reaches the component.
 */
export interface UIFieldProps {
  /** Unique field identifier (matches field.name) */
  id?: string;
  /** Field name in the form */
  name: string;
  /** Current field value */
  value: unknown;
  /** Notify the engine of a new value */
  onChange: (value: unknown) => void;
  /** Notify the engine that focus left the field */
  onBlur: () => void;
  /** Validation error message to display */
  error?: string;
  /** Whether the field should be non-interactive */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Field label (for adapters that render their own label) */
  label?: string;
  /**
   * HTML input `type` attribute — set for text-family fields:
   * `"email"`, `"tel"`, `"url"`, `"number"`, `"password"`, `"time"`, `"datetime-local"`
   */
  type?: string;
  /** Options for selection fields: select, multiselect, radio */
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  /** Any extra props forwarded from field.componentProps */
  [key: string]: unknown;
}

/**
 * Props for the optional FormItem wrapper that adds label + error + description
 * around a field component.
 */
export interface UIFormItemProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Contract every UIAdapter must satisfy.
 *
 * Wire any component library (Ant Design, MUI, ShadCN, Chakra, custom, etc.)
 * by mapping field types to your components.
 *
 * @example
 * const myUIAdapter = createUIAdapter({
 *   components: {
 *     text:      MyInput,
 *     email:     MyInput,   // or omit — text is the automatic fallback
 *     textarea:  MyTextarea,
 *     select:    MySelect,
 *     checkbox:  MyCheckbox,
 *   },
 *   FormItem: MyFormItem,
 * });
 */
export interface UIAdapter {
  /**
   * Component registry keyed by FieldType (or any custom string type).
   *
   * Resolution order for field.type → component:
   *  1. components[field.type]           — exact match
   *  2. components["text"]               — text-family fallback
   *  3. fallback                          — catch-all component
   *  4. null + dev warning               — unregistered type
   */
  components: Partial<Record<FieldType | string, ComponentType<UIFieldProps>>>;

  /**
   * Optional wrapper rendered around each non-inline field.
   * Receives label, error, description, required.
   * If omitted fields render bare (no label/error chrome).
   */
  FormItem?: ComponentType<UIFormItemProps>;

  /**
   * Field types that render inline (skip FormItem wrapping).
   * Defaults to `["checkbox", "switch"]`.
   * Override to add/remove types that should render without the FormItem frame.
   */
  inlineTypes?: Array<FieldType | string>;

  /**
   * Catch-all component rendered when field.type has no registered component.
   * Useful for graceful degradation or debug stubs in development.
   */
  fallback?: ComponentType<UIFieldProps>;
}

// ─── RavenForm Props ───────────────────────────────────────────────────────────
export interface RavenFormProps {
  schema: FormSchema;
  /** Optional — falls back to the adapter registered in <RavenFormProvider>. */
  adapter?: FormAdapter;
  /** Optional — falls back to the UI adapter registered in <RavenFormProvider>. */
  ui?: UIAdapter;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  showStateInspector?: boolean;
  className?: string;
  submitClassName?: string;
}

// ─── RavenWizardForm Props ─────────────────────────────────────────────────────
export interface RavenWizardFormProps {
  steps: WizardStep[];
  /** Optional — falls back to the adapter registered in <RavenFormProvider>. */
  adapter?: FormAdapter;
  /** Optional — falls back to the UI adapter registered in <RavenFormProvider>. */
  ui?: UIAdapter;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  showStateInspector?: boolean;
  className?: string;
}
