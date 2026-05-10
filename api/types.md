# Types Reference

Complete TypeScript type definitions exported by Raven Form.

## `FieldType`

```ts
type FieldType =
  // Basic text inputs
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "password"
  // Multi-line
  | "textarea"
  // Date / time
  | "date"
  | "time"
  | "datetime"
  // Selection
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  // Toggle
  | "switch"
  // Special
  | "otp"
  | "file"
  | "range"
  | "color"
  | "rating"
  // Compound
  | "repeater"
  // Escape hatch
  | "custom";
```

---

## `FormField<T>`

```ts
interface FormField<T = unknown> {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: T;
  disabled?: boolean | ((formValues: Record<string, unknown>) => boolean);
  hidden?: boolean | ((formValues: Record<string, unknown>) => boolean);
  validation?: FieldValidation<T>;
  mask?: (value: string) => string;
  formatter?: (value: T) => unknown;
  parser?: (value: unknown) => T;
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  colSpan?: number; // 1–12
  dependsOn?: string[];
  render?: (context: FieldRenderContext) => ReactNode;
  componentProps?: Record<string, unknown>;
  repeaterConfig?: RepeaterConfig;
}
```

---

## `FormSchema`

```ts
interface FormSchema {
  fields: FormField[];
  columns?: number; // default: 12
  gap?: string; // e.g. 'gap-4'
  steps?: WizardStep[];
}
```

---

## `WizardStep`

```ts
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: string; // Iconify icon name
  fields: FormField[];
  columns?: number;
}
```

---

## `RepeaterConfig`

```ts
interface RepeaterConfig {
  fields: FormField[];
  minRows?: number;
  maxRows?: number;
  addLabel?: string;
  removeLabel?: string;
  defaultRow?: Record<string, unknown>;
}
```

---

## `FieldValidation<T>`

```ts
interface FieldValidation<T = unknown> {
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
```

---

## `FieldRenderContext`

```ts
interface FieldRenderContext {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}
```

---

## `FieldBinding`

```ts
interface FieldBinding {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  isDirty?: boolean;
  isTouched?: boolean;
}
```

---

## `FormAdapter`

```ts
interface FormAdapter {
  FormProvider: React.FC<FormAdapterProviderProps>;
  useField: (name: string) => FieldBinding;
  useSubmit: () => () => void;
  useWatch: (names?: string[]) => Record<string, unknown>;
  useTrigger?: () => (names: string[]) => Promise<boolean>;
}
```

---

## `FormAdapterProviderProps`

```ts
interface FormAdapterProviderProps {
  schema: FormSchema;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
}
```

---

## `UIAdapter`

```ts
interface UIAdapter {
  Input: React.FC<UIInputProps>;
  Textarea: React.FC<UIInputProps>;
  PasswordInput: React.FC<UIInputProps>;
  DatePicker: React.FC<UIInputProps>;
  Select: React.FC<UISelectProps>;
  MultiSelect: React.FC<UISelectProps>;
  Radio: React.FC<UISelectProps>;
  Checkbox: React.FC<UIInputProps>;
  Switch: React.FC<UIInputProps>;
  OTPInput: React.FC<UIInputProps>;
  FileInput: React.FC<UIInputProps>;
  Range: React.FC<UIInputProps>;
  ColorPicker: React.FC<UIInputProps>;
  Rating: React.FC<UIInputProps>;
  FormItem: React.FC<UIFormItemProps>;
}
```

---

## `UIInputProps`

```ts
interface UIInputProps {
  id?: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  error?: string;
  className?: string;
  label?: string;
  [key: string]: unknown;
}
```

---

## `UISelectProps`

```ts
interface UISelectProps extends UIInputProps {
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
}
```

---

## `UIFormItemProps`

```ts
interface UIFormItemProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}
```

---

## `RavenFormProps`

```ts
interface RavenFormProps {
  schema: FormSchema;
  adapter: FormAdapter;
  ui: UIAdapter;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  showStateInspector?: boolean;
}
```

---

## `RavenWizardProps`

```ts
interface RavenWizardProps extends RavenFormProps {}
// same props as RavenFormProps; schema.steps drives the wizard
```

---

## `MaskOptions`

```ts
interface MaskOptions {
  /** Mask pattern string, e.g. `"(***) ***-****"` */
  pattern: string;
  /** Custom token definitions (default token `*` matches any char) */
  tokens?: Record<string, MaskToken>;
}

interface MaskToken {
  pattern: RegExp;
  transform?: (char: string) => string;
}
```

The `mask` field on `FormField` accepts:
- A **pattern string**: `"(***) ***-****"`
- A **`MaskOptions` object** with custom tokens
- A **function**: `(value: string) => string`

---

## `UseMaskResult`

```ts
interface UseMaskResult {
  maskedValue: string;
  rawValue: string;
  isComplete: boolean;
  onChangeHandler: (input: string) => void;
}
```
