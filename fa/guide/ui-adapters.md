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

راهنمای کامل گام‌به‌گام — شامل تمام ۱۳ نوع فیلد، ظرف `FormItem`، کامپوننت `fallback`، `createUIAdapter`، ثبت سراسری و ارسال props اضافی — در صفحه اختصاصی زیر موجود است:

👉 **[ساخت UIAdapter سفارشی ←](/fa/guide/custom-ui-adapter)**
