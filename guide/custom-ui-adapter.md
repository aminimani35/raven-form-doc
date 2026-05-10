# Building a Custom UI Adapter

A `UIAdapter` tells Raven Form **which React component to render for each field type**. You can wire any component library — Radix UI, Chakra, MUI, plain HTML, or your own design system — in under an hour.

---

## The contract

```ts
interface UIAdapter {
  /** Map of field type → React component */
  components: Partial<Record<FieldType | string, ComponentType<UIFieldProps>>>;

  /** Optional label + error + description wrapper rendered around each field */
  FormItem?: ComponentType<UIFormItemProps>;

  /**
   * Field types that render inline — they receive the full UIFieldProps
   * but skip the FormItem wrapper entirely.
   * Default: ["checkbox", "switch"]
   */
  inlineTypes?: Array<FieldType | string>;

  /** Catch-all component rendered when no exact or text-family match exists */
  fallback?: ComponentType<UIFieldProps>;
}
```

---

## Props every field component receives

```ts
interface UIFieldProps {
  id?: string;           // matches field.name — useful for <label htmlFor>
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;        // validation error message
  disabled?: boolean;
  placeholder?: string;
  label?: string;        // forwarded for inline components (checkbox, switch)
  /**
   * Auto-injected for text-family types:
   *   email → "email" | tel → "tel" | url → "url" | number → "number"
   *   password → "password" | time → "time" | datetime → "datetime-local"
   */
  type?: string;
  /** For select / multiselect / radio */
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  /** Any extra props forwarded from field.componentProps */
  [key: string]: unknown;
}
```

---

## Component resolution order

When the engine encounters a field, it picks a component using this priority chain:

```
field.type → components[field.type]
           → components["text"]        (text-family fallback)
           → adapter.fallback
           → null + console.warn
```

**Text-family types** that fall through to `components["text"]`:
`email`, `tel`, `url`, `number`, `password`, `time`, `datetime`

---

## Step 1 — Basic text inputs

```tsx
import type { UIFieldProps } from 'raven-form'

// Handles: text, email, tel, url, number, password, time, datetime
// The engine injects the correct HTML `type` attribute automatically.
export function TextInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  error,
  type,
}: UIFieldProps) {
  return (
    <input
      id={id ?? name}
      name={name}
      type={type ?? 'text'}
      value={(value as string) ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  )
}
```

## Step 2 — Textarea

```tsx
export function TextareaInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
  error,
  rows,          // forwarded from field.componentProps
}: UIFieldProps) {
  return (
    <textarea
      id={id ?? name}
      name={name}
      value={(value as string) ?? ''}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      rows={(rows as number) ?? 3}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  )
}
```

## Step 3 — Select

```tsx
export function SelectInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  disabled,
}: UIFieldProps) {
  return (
    <select
      id={id ?? name}
      name={name}
      value={(value as string) ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    >
      <option value=''>— Select —</option>
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
```

## Step 4 — Multiselect

`value` is an array of selected option values. Call `onChange` with a new array.

```tsx
export function MultiSelectInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  disabled,
}: UIFieldProps) {
  const selected = (value as string[]) ?? []

  function toggle(v: string) {
    const next = selected.includes(v)
      ? selected.filter((x) => x !== v)
      : [...selected, v]
    onChange(next)
  }

  return (
    <div role='group' id={id ?? name} onBlur={onBlur}>
      {options.map((o) => (
        <label key={String(o.value)} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
          <input
            type='checkbox'
            checked={selected.includes(String(o.value))}
            disabled={disabled || o.disabled}
            onChange={() => toggle(String(o.value))}
          />
          {o.label}
        </label>
      ))}
    </div>
  )
}
```

## Step 5 — Radio group

```tsx
export function RadioInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  disabled,
}: UIFieldProps) {
  return (
    <div role='radiogroup' id={id ?? name} onBlur={onBlur}>
      {options.map((o) => (
        <label key={String(o.value)} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <input
            type='radio'
            name={name}
            value={String(o.value)}
            checked={value === o.value}
            disabled={disabled || o.disabled}
            onChange={() => onChange(o.value)}
          />
          {o.label}
        </label>
      ))}
    </div>
  )
}
```

## Step 6 — Checkbox (inline)

Checkbox and switch are **inline** by default — they skip `FormItem` and render label themselves.

```tsx
export function CheckboxInput({ name, value, onChange, label, disabled }: UIFieldProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <input
        type='checkbox'
        name={name}
        checked={Boolean(value)}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}
```

## Step 7 — Switch (inline)

```tsx
export function SwitchInput({ name, value, onChange, label, disabled }: UIFieldProps) {
  const on = Boolean(value)
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <button
        type='button'
        role='switch'
        aria-checked={on}
        disabled={disabled}
        onClick={() => onChange(!on)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          border: 'none',
          background: on ? '#10b981' : '#d1d5db',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: on ? 20 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
          }}
        />
      </button>
      <span>{label}</span>
    </label>
  )
}
```

## Step 8 — Date input

```tsx
export function DateInput({ id, name, value, onChange, onBlur, disabled, error }: UIFieldProps) {
  return (
    <input
      id={id ?? name}
      type='date'
      value={(value as string) ?? ''}
      disabled={disabled}
      aria-invalid={!!error}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  )
}
```

## Step 9 — File upload

`value` stores a `File` object (or `null`). Always call `onChange` with the `File`, not a path string.

```tsx
export function FileInput({ id, name, onChange, onBlur, disabled }: UIFieldProps) {
  return (
    <input
      id={id ?? name}
      type='file'
      disabled={disabled}
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      onBlur={onBlur}
    />
  )
}
```

## Step 10 — Range slider

```tsx
export function RangeInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  min,
  max,
  step,
}: UIFieldProps) {
  return (
    <input
      id={id ?? name}
      type='range'
      value={(value as number) ?? 0}
      min={(min as number) ?? 0}
      max={(max as number) ?? 100}
      step={(step as number) ?? 1}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      onBlur={onBlur}
    />
  )
}
```

## Step 11 — Color picker

```tsx
export function ColorInput({ id, name, value, onChange, onBlur, disabled }: UIFieldProps) {
  return (
    <input
      id={id ?? name}
      type='color'
      value={(value as string) ?? '#000000'}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  )
}
```

## Step 12 — Rating

```tsx
export function RatingInput({ id, name, value, onChange, disabled, max }: UIFieldProps) {
  const total = (max as number) ?? 5
  const current = (value as number) ?? 0
  return (
    <div id={id ?? name} style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: total }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type='button'
          disabled={disabled}
          aria-label={`${star} star`}
          onClick={() => onChange(star)}
          style={{
            background: 'none',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            fontSize: 22,
            color: star <= current ? '#f59e0b' : '#d1d5db',
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
```

## Step 13 — OTP input

```tsx
import { useRef } from 'react'

export function OTPInput({ id, name, value, onChange, onBlur, disabled }: UIFieldProps) {
  const digits = 6
  const chars = String(value ?? '').padEnd(digits, '').slice(0, digits).split('')
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleKey(i: number, val: string) {
    const next = [...chars]
    next[i] = val.slice(-1)
    const joined = next.join('').trimEnd()
    onChange(joined)
    if (val && i < digits - 1) refs.current[i + 1]?.focus()
  }

  function handleBackspace(i: number) {
    const next = [...chars]
    next[i] = ''
    onChange(next.join('').trimEnd())
    if (i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div id={id ?? name} style={{ display: 'flex', gap: 8 }} onBlur={onBlur}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={ch}
          disabled={disabled}
          onChange={(e) => handleKey(i, e.target.value)}
          onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(i)}
          style={{ width: 40, height: 48, textAlign: 'center', fontSize: 20 }}
        />
      ))}
    </div>
  )
}
```

---

## FormItem wrapper

`FormItem` adds the label, description, and error message around every non-inline field. If you omit it, fields render bare (no chrome).

```tsx
import type { UIFormItemProps } from 'raven-form'

export function FormItem({
  label,
  error,
  description,
  required,
  children,
  className,
}: UIFormItemProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontWeight: 500, fontSize: 14 }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 2 }}> *</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>{description}</p>
      )}
      {error && (
        <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{error}</p>
      )}
    </div>
  )
}
```

---

## Fallback component

Rendered automatically when a field type has no registered component. Useful for surfacing gaps during development.

```tsx
export function FallbackField({ name, type }: UIFieldProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        padding: '8px 12px',
        border: '1px dashed #f59e0b',
        borderRadius: 8,
        color: '#92400e',
        fontSize: 12,
      }}>
        ⚠️ No component registered for type <code>"{type ?? name}"</code>
      </div>
    )
  }
  return null
}
```

---

## Assembling the adapter

Use `createUIAdapter` to validate your config at development time and get the fully-typed adapter back:

```tsx
import { createUIAdapter } from 'raven-form'

import { TextInput }        from './fields/TextInput'
import { TextareaInput }    from './fields/TextareaInput'
import { SelectInput }      from './fields/SelectInput'
import { MultiSelectInput } from './fields/MultiSelectInput'
import { RadioInput }       from './fields/RadioInput'
import { CheckboxInput }    from './fields/CheckboxInput'
import { SwitchInput }      from './fields/SwitchInput'
import { DateInput }        from './fields/DateInput'
import { FileInput }        from './fields/FileInput'
import { RangeInput }       from './fields/RangeInput'
import { ColorInput }       from './fields/ColorInput'
import { RatingInput }      from './fields/RatingInput'
import { OTPInput }         from './fields/OTPInput'
import { FormItem }         from './FormItem'
import { FallbackField }    from './FallbackField'

export const MyUIAdapter = createUIAdapter({
  components: {
    // ── Text-family (one component handles all unless overridden)
    text:        TextInput,   // also catches: email, tel, url, number, password, time, datetime
    textarea:    TextareaInput,

    // ── Selection
    select:      SelectInput,
    multiselect: MultiSelectInput,
    radio:       RadioInput,

    // ── Toggles (inline — skip FormItem)
    checkbox:    CheckboxInput,
    switch:      SwitchInput,

    // ── Temporal
    date:        DateInput,

    // ── Specials
    file:        FileInput,
    range:       RangeInput,
    color:       ColorInput,
    rating:      RatingInput,
    otp:         OTPInput,
  },
  FormItem,
  inlineTypes: ['checkbox', 'switch'],
  fallback:    FallbackField,
})
```

---

## Registering globally

```tsx
import { RavenFormProvider } from 'raven-form'
import { MyUIAdapter }       from './adapters/MyUIAdapter'
import { RHFAdapter }        from 'raven-form/adapters/rhf'

function App() {
  return (
    <RavenFormProvider uiAdapter={MyUIAdapter} formAdapter={RHFAdapter}>
      <Router />
    </RavenFormProvider>
  )
}
```

Any `<RavenForm>` inside the tree inherits `MyUIAdapter` automatically. Override per-form with the `ui` prop:

```tsx
<RavenForm schema={schema} ui={AltUIAdapter} onSubmit={handleSubmit} />
```

---

## Forwarding extra props via `componentProps`

Pass arbitrary props into a specific field component through the `componentProps` field schema property. They arrive on `UIFieldProps` via the index signature:

```ts
{
  name: 'description',
  type: 'textarea',
  label: 'Description',
  componentProps: {
    rows: 6,
    resize: 'none',
    spellCheck: false,
  },
}
```

Inside `TextareaInput`:

```tsx
const { rows, resize, spellCheck, ...rest } = props
```

---

## Adapter checklist

| ✅ Item | Why |
|---|---|
| `components.text` registered | Text-family fallback works for email, tel, url, number, password, time, datetime |
| `components.textarea` registered | Multi-line text fields render |
| `components.select` registered | Drop-down fields render |
| `components.checkbox` registered | The most common inline field works |
| `FormItem` provided | Fields get label + error + description chrome |
| `inlineTypes` includes `'checkbox'` and `'switch'` | Inline fields don't get double-wrapped |
| `fallback` provided | Unknown field types show a clear dev warning instead of silently disappearing |
| Inline components render their own `label` | `FormItem` is skipped for inline types, so the label must come from the component itself |
| `onChange` called with correct value type | `checkbox`/`switch` → `boolean`; `multiselect` → `string[]`; `number`/`range`/`rating` → `number`; `file` → `File \| null`; all others → `string` |

---

## See also

- [UI Adapters overview](/guide/ui-adapters) — built-in adapters (ShadCN, Ant Design)
- [Custom FormAdapter](/guide/custom-adapter) — writing a custom form-state adapter
- [Field Types](/guide/field-types) — full list of `FieldType` values
- [componentProps reference](/api/smart-form#field-schema) — forwarding props to field components
