# ساخت UIAdapter سفارشی

یک `UIAdapter` مشخص می‌کند که Raven Form برای هر نوع فیلد **کدام کامپوننت React را رندر کند**. می‌توانید هر کتابخانه کامپوننتی — Radix, Chakra, MUI، HTML خالص یا سیستم طراحی اختصاصی خودتان — را در کمتر از یک ساعت وصل کنید.

---

## قرارداد کلی

```ts
interface UIAdapter {
  /** نگاشت نوع فیلد → کامپوننت React */
  components: Partial<Record<FieldType | string, ComponentType<UIFieldProps>>>;

  /** ظرف اختیاری label + error + description دور هر فیلد */
  FormItem?: ComponentType<UIFormItemProps>;

  /**
   * فیلدهایی که به‌صورت inline رندر می‌شوند — FormItem را دور خود نمی‌گیرند.
   * پیش‌فرض: ["checkbox", "switch"]
   */
  inlineTypes?: Array<FieldType | string>;

  /** کامپوننت جایگزین برای نوع‌های فاقد ثبت */
  fallback?: ComponentType<UIFieldProps>;
}
```

---

## props‌هایی که هر کامپوننت فیلد دریافت می‌کند

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
  label?: string;         // برای کامپوننت‌های inline (checkbox/switch)
  /**
   * به‌طور خودکار برای انواع متنی تزریق می‌شود:
   * email → "email" | tel → "tel" | url → "url" | number → "number"
   * password → "password" | time → "time" | datetime → "datetime-local"
   */
  type?: string;
  /** برای فیلدهای انتخابی (select/multiselect/radio) */
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  /** prop‌های اضافی از field.componentProps */
  [key: string]: unknown;
}
```

---

## ترتیب انتخاب کامپوننت

```
field.type → components[field.type]
           → components["text"]        (fallback برای انواع متنی)
           → adapter.fallback
           → null + console.warn
```

**انواع متنی** که به `components["text"]` fallback می‌شوند:
`email`، `tel`، `url`، `number`، `password`، `time`، `datetime`

---

## مرحله ۱ — ورودی متنی

```tsx
import type { UIFieldProps } from 'raven-form'

// handles: text, email, tel, url, number, password, time, datetime
export function TextInput({
  id, name, value, onChange, onBlur,
  placeholder, disabled, error, type,
}: UIFieldProps) {
  return (
    <input
      id={id ?? name}
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

## مرحله ۲ — متن چندخطی (textarea)

```tsx
export function TextareaInput({ id, name, value, onChange, onBlur, placeholder, disabled, error, rows }: UIFieldProps) {
  return (
    <textarea
      id={id ?? name}
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

## مرحله ۳ — لیست انتخابی (select)

```tsx
export function SelectInput({ id, name, value, onChange, onBlur, options = [], disabled }: UIFieldProps) {
  return (
    <select
      id={id ?? name}
      value={(value as string) ?? ''}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    >
      <option value=''>— انتخاب کنید —</option>
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
```

## مرحله ۴ — انتخاب چندگانه (multiselect)

`value` آرایه‌ای از مقادیر انتخاب‌شده است. `onChange` را با آرایه جدید صدا بزنید.

```tsx
export function MultiSelectInput({ id, name, value, onChange, onBlur, options = [], disabled }: UIFieldProps) {
  const selected = (value as string[]) ?? []
  const toggle = (v: string) => {
    const next = selected.includes(v)
      ? selected.filter((x) => x !== v)
      : [...selected, v]
    onChange(next)
  }
  return (
    <div role='group' id={id ?? name} onBlur={onBlur}>
      {options.map((o) => (
        <label key={String(o.value)} style={{ display: 'flex', gap: 6 }}>
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

## مرحله ۵ — دکمه رادیویی (radio)

```tsx
export function RadioInput({ id, name, value, onChange, onBlur, options = [], disabled }: UIFieldProps) {
  return (
    <div role='radiogroup' id={id ?? name} onBlur={onBlur}>
      {options.map((o) => (
        <label key={String(o.value)} style={{ display: 'flex', gap: 8 }}>
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

## مرحله ۶ — چک‌باکس (inline)

چک‌باکس و سوییچ به‌صورت پیش‌فرض **inline** هستند — `FormItem` را دور خود نمی‌گیرند و label را خودشان رندر می‌کنند.

```tsx
export function CheckboxInput({ name, value, onChange, label, disabled }: UIFieldProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

## مرحله ۷ — سوییچ (inline)

```tsx
export function SwitchInput({ name, value, onChange, label, disabled }: UIFieldProps) {
  const on = Boolean(value)
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        type='button'
        role='switch'
        aria-checked={on}
        disabled={disabled}
        onClick={() => onChange(!on)}
        style={{
          width: 40, height: 22, borderRadius: 11, border: 'none',
          background: on ? '#10b981' : '#d1d5db',
          position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: on ? 20 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
        }} />
      </button>
      <span>{label}</span>
    </label>
  )
}
```

## مرحله ۸ — انتخاب تاریخ

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

## مرحله ۹ — آپلود فایل

`value` یک شیء `File` (یا `null`) است. `onChange` را با خود `File` صدا بزنید، نه مسیر آن.

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

## مرحله ۱۰ — ستاره‌بندی (rating)

```tsx
export function RatingInput({ id, name, value, onChange, disabled, max }: UIFieldProps) {
  const total = (max as number) ?? 5
  const current = (value as number) ?? 0
  return (
    <div id={id ?? name} style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: total }, (_, i) => i + 1).map((star) => (
        <button key={star} type='button' disabled={disabled}
          onClick={() => onChange(star)}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 22, color: star <= current ? '#f59e0b' : '#d1d5db' }}>
          ★
        </button>
      ))}
    </div>
  )
}
```

---

## ظرف FormItem

```tsx
import type { UIFormItemProps } from 'raven-form'

export function FormItem({ label, error, description, required, children, className }: UIFormItemProps) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontWeight: 500, fontSize: 14 }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginRight: 2 }}> *</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>{description}</p>
      )}
      {error && <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{error}</p>}
    </div>
  )
}
```

---

## کامپوننت fallback

```tsx
export function FallbackField({ name, type }: UIFieldProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ padding: '8px 12px', border: '1px dashed #f59e0b', borderRadius: 8, color: '#92400e', fontSize: 12 }}>
        ⚠️ کامپوننتی برای نوع <code>"{type ?? name}"</code> ثبت نشده است
      </div>
    )
  }
  return null
}
```

---

## ساخت نهایی آداپتور

```tsx
import { createUIAdapter } from 'raven-form'

export const MyUIAdapter = createUIAdapter({
  components: {
    text:        TextInput,        // fallback برای email/tel/url/number/password/time/datetime
    textarea:    TextareaInput,
    select:      SelectInput,
    multiselect: MultiSelectInput,
    radio:       RadioInput,
    checkbox:    CheckboxInput,
    switch:      SwitchInput,
    date:        DateInput,
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

## ثبت سراسری

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

برای override کردن در یک فرم خاص، prop مربوطه را مستقیم پاس دهید:

```tsx
<RavenForm schema={schema} ui={OtherUIAdapter} onSubmit={handleSubmit} />
```

---

## ارسال props اضافی با `componentProps`

```ts
{
  name: 'description',
  type: 'textarea',
  label: 'توضیحات',
  componentProps: {
    rows: 6,
    resize: 'none',
  },
}
```

---

## چک‌لیست آداپتور

| مورد | دلیل |
|---|---|
| `components.text` ثبت شده | خودکار برای email/tel/url/number/password/time/datetime fallback می‌شود |
| `components.textarea` ثبت شده | فیلدهای متن چندخطی رندر می‌شوند |
| `FormItem` فراهم شده | فیلدها label، error و description دارند |
| `inlineTypes` شامل `'checkbox'` و `'switch'` | دوباره wrap نمی‌شوند |
| `fallback` فراهم شده | نوع‌های ناشناس به‌جای حذف بی‌صدا، هشدار می‌دهند |
| کامپوننت‌های inline، label را خودشان رندر می‌کنند | چون FormItem برای آن‌ها اجرا نمی‌شود |
| نوع صحیح به `onChange` داده می‌شود | `checkbox`/`switch` → `boolean`؛ `multiselect` → `string[]`؛ `rating`/`range` → `number`؛ `file` → `File \| null`؛ بقیه → `string` |

---

## مطالب مرتبط

- [آداپتورهای UI](/fa/guide/ui-adapters) — آداپتورهای آماده (ShadCN، Ant Design)
- [آداپتور فرم سفارشی](/fa/guide/custom-adapter) — ساخت آداپتور مدیریت state فرم
- [انواع فیلد](/fa/guide/field-types) — لیست کامل `FieldType`
