# API — انواع (Types)

مرجع کامل انواع TypeScript موجود در `@/form-engine/types`.

## FormSchema

```ts
interface FormSchema {
  id: string;
  columns?: number; // پیش‌فرض: ۱۲
  fields: FormField[];
  messages?: Record<string, string>;
}
```

## FormField

```ts
interface FormField {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
  colSpan?: number; // ۱–۱۲، پیش‌فرض: ۶
  disabled?: boolean | ((values: Record<string, unknown>) => boolean);
  hidden?: boolean | ((values: Record<string, unknown>) => boolean);
  validation?: FieldValidation;
  mask?: string | ((v: string) => string);
  formatter?: string | ((v: unknown) => unknown);
  parser?: string | ((v: unknown) => unknown);
  options?: Option[];
  dependsOn?: string[];
  render?: (ctx: RenderContext) => React.ReactNode;
  componentProps?: Record<string, unknown>;
  repeaterConfig?: RepeaterConfig;
}
```

## FieldType

```ts
type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "password"
  | "textarea"
  | "date"
  | "time"
  | "datetime"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "switch"
  | "otp"
  | "file"
  | "range"
  | "color"
  | "rating"
  | "repeater"
  | "custom";
```

## FieldValidation

```ts
interface FieldValidation {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (
    value: unknown,
    allValues: Record<string, unknown>,
  ) => string | true | Promise<string | true>;
  deps?: string[];
}
```

## Option

```ts
interface Option {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}
```

## RepeaterConfig

```ts
interface RepeaterConfig {
  fields: FormField[];
  minRows?: number;
  maxRows?: number;
  addLabel?: string;
}
```

## FormAdapter

```ts
interface FormAdapter {
  FormProvider: React.FC<{ schema: FormSchema; children: React.ReactNode }>;
  useField: (name: string, schema: FormSchema) => FieldBinding;
  useSubmit: (
    schema: FormSchema,
    onSubmit: (v: Record<string, unknown>) => void,
  ) => () => void;
  useWatch: (name: string) => unknown;
  useTrigger?: (name: string) => () => Promise<boolean>;
}
```

## FieldBinding

```ts
interface FieldBinding {
  value: unknown;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  error?: string;
}
```

## WizardStep

```ts
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  onNext?: (values: Record<string, unknown>) => boolean | Promise<boolean>;
}
```

## RenderContext

```ts
interface RenderContext {
  name: string;
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled: boolean;
  schema: FormSchema;
  allValues: Record<string, unknown>;
}
```

## UIAdapter

```ts
interface UIAdapter {
  components: Partial<Record<FieldType | string, ComponentType<UIFieldProps>>>;
  FormItem?: ComponentType<UIFormItemProps>;
  inlineTypes?: Array<FieldType | string>;
  fallback?: ComponentType<UIFieldProps>;
}
```

## UIFieldProps

```ts
interface UIFieldProps {
  id?: string;
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  type?: string;
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  [key: string]: unknown;
}
```
