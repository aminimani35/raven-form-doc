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

```tsx
import { createUIAdapter } from 'raven-form'
import type { UIFieldProps, UIFormItemProps } from 'raven-form'

const TextInput = ({ value, onChange, onBlur, placeholder, disabled, type, error }: UIFieldProps) => (
  <input
    type={type ?? 'text'}
    value={(value as string) ?? ''}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    disabled={disabled}
    style={{ border: error ? '1px solid red' : '1px solid #ccc', padding: 6 }}
  />
)

const FormItem = ({ label, error, description, required, children }: UIFormItemProps) => (
  <div style={{ marginBottom: 12 }}>
    {label && <label>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>}
    {children}
    {error && <p style={{ color: 'red', fontSize: 12 }}>{error}</p>}
  </div>
)

export const MyUIAdapter = createUIAdapter({
  components: {
    text: TextInput,      // fallback برای email/tel/url/number/password/time/datetime
    textarea: ({ value, onChange, onBlur }: UIFieldProps) => (
      <textarea value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
    ),
    select: ({ value, onChange, options }: UIFieldProps) => (
      <select value={value as string} onChange={(e) => onChange(e.target.value)}>
        {options?.map((o) => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
      </select>
    ),
    checkbox: ({ value, onChange, label }: UIFieldProps) => (
      <label><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /> {label}</label>
    ),
  },
  FormItem,
  inlineTypes: ['checkbox', 'switch'],
})
```
