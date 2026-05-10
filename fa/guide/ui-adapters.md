# آداپتورهای UI

آداپتورهای UI مشخص می‌کنند که فیلدهای فرم با **کدام کامپوننت‌های بصری** رندر شوند.

## آداپتورهای موجود

| آداپتور           | کتابخانه             |
|---|---|
| `AntDUIAdapter`   | Ant Design 5.x |
| `ShadCNUIAdapter` | shadcn/ui + Tailwind |

---

## Ant Design

```bash
npm install antd
```

```tsx
import { RavenForm } from 'raven-form'
import { RHFAdapter } from 'raven-form/adapters/rhf'
import { AntDUIAdapter } from 'raven-form/ui/antd'

<RavenForm
  schema={schema}
  adapter={RHFAdapter}
  ui={AntDUIAdapter}
  onSubmit={handleSubmit}
/>
```

---

## ShadCN/ui

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add input label select textarea switch
```

```tsx
import { RavenForm } from 'raven-form'
import { RHFAdapter } from 'raven-form/adapters/rhf'
import { ShadCNUIAdapter } from 'raven-form/ui/shadcn'

<RavenForm
  schema={schema}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
/>
```

---

## اینترفیس `UIAdapter`

```ts
interface UIAdapter {
  /**
   * رجیستری کامپوننت‌ها بر اساس نوع فیلد.
   * اولویت انتخاب:
   *   1. components[field.type]     — تطابق دقیق
   *   2. components["text"]         — fallback برای انواع متنی (email/tel/url/...)
   *   3. fallback                    — کامپوننت جهانی برای انواع ناشناخته
   *   4. null + هشدار در console
   */
  components: Partial<Record<FieldType | string, ComponentType<UIFieldProps>>>;
  /** کامپوننت ظرف فیلد با label، error و description (اختیاری). */
  FormItem?: ComponentType<UIFormItemProps>;
  /** انواعی که بدون FormItem رندر می‌شوند. پیش‌فرض: ["checkbox", "switch"]. */
  inlineTypes?: Array<FieldType | string>;
  /** کامپوننت جایگزین برای انواع فاقد ثبت. */
  fallback?: ComponentType<UIFieldProps>;
}
```

**مثال — آداپتور ساده با HTML خالص:**

```tsx
import { createUIAdapter } from 'raven-form'
import type { UIFieldProps, UIFormItemProps } from 'raven-form'

// ── کامپوننت‌های فیلد ────────────────────────────────────────────────────────
const TextInput = ({ id, name, value, onChange, onBlur, placeholder, disabled, type, error }: UIFieldProps) => (
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

const SelectInput = ({ id, name, value, onChange, onBlur, options = [], disabled }: UIFieldProps) => (
  <select id={id ?? name} value={(value as string) ?? ''} disabled={disabled}
    onChange={(e) => onChange(e.target.value)} onBlur={onBlur}>
    <option value=''>— انتخاب کنید —</option>
    {options.map((o) => (
      <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>{o.label}</option>
    ))}
  </select>
)

const CheckboxInput = ({ name, value, onChange, label, disabled }: UIFieldProps) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <input type='checkbox' name={name} checked={Boolean(value)}
      disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
)

// ── ظرف FormItem (label + error + description) ───────────────────────────────
const FormItem = ({ label, error, description, required, children }: UIFormItemProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
    {label && (
      <label style={{ fontWeight: 500, fontSize: 14 }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
    )}
    {children}
    {description && !error && <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>{description}</p>}
    {error && <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{error}</p>}
  </div>
)

// ── ساخت آداپتور ────────────────────────────────────────────────────────────
export const MyUIAdapter = createUIAdapter({
  components: {
    text:       TextInput,  // fallback برای email/tel/url/number/password/time/datetime
    textarea:   ({ id, name, value, onChange, onBlur, placeholder, disabled }: UIFieldProps) => (
      <textarea id={id ?? name} value={(value as string) ?? ''} placeholder={placeholder}
        disabled={disabled} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
    ),
    select:     SelectInput,
    multiselect: SelectInput,
    radio:      SelectInput,
    checkbox:   CheckboxInput,
    switch:     CheckboxInput,
  },
  FormItem,
  inlineTypes: ['checkbox', 'switch'], // این انواع FormItem نمی‌گیرند
})
```

::: tip
راهنمای کامل شامل تمام ۱۳ نوع فیلد را در [ساخت UIAdapter سفارشی](/fa/guide/custom-ui-adapter) ببینید.
:::

---

## `UIFieldProps`

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
  /** برای فیلدهای متنی (email/tel/url/number/password/time/datetime-local) به‌صورت خودکار تزریق می‌شود */
  type?: string;
  /** برای فیلدهای انتخابی (select/multiselect/radio) */
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  /** prop های اضافی از field.componentProps */
  [key: string]: unknown;
}
```

---

## ساخت آداپتور UI سفارشی

راهنمای کامل گام‌به‌گام — شامل تمام ۱۳ نوع فیلد، ظرف `FormItem`، کامپوننت `fallback`، `createUIAdapter`، ثبت سراسری و ارسال props اضافی — در صفحه اختصاصی زیر موجود است:

👉 **[ساخت UIAdapter سفارشی ←](/fa/guide/custom-ui-adapter)**
