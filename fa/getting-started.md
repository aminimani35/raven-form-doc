# شروع سریع

**Raven Form** یک موتور فرم اسکیما-محور و آداپتور-محور برای React است. فرمت را یک بار به صورت یک شیء JavaScript توصیف کن، کتابخانه مدیریت حالت فرم و کتابخانه UI مورد نظرت را انتخاب کن، و Raven Form بقیه را انجام می‌دهد.

## نصب

```bash
# npm
npm install raven-form react-hook-form

# pnpm
pnpm add raven-form react-hook-form
```

> **وابستگی‌های UI** — آداپتور UI مورد نظرت را نصب کن:
>
> ```bash
> # ShadCN/ui (توصیه شده)
> npm install @shadcn/ui
>
> # Ant Design
> npm install antd
> ```

---

## اولین فرم شما

### ۱. تعریف اسکیما

```ts
import type { FormSchema } from "raven-form";

const schema: FormSchema = {
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "نام",
      colSpan: 6,
      validation: { required: "نام الزامی است" },
    },
    {
      name: "lastName",
      type: "text",
      label: "نام خانوادگی",
      colSpan: 6,
      validation: { required: true },
    },
    {
      name: "email",
      type: "email",
      label: "آدرس ایمیل",
      colSpan: 12,
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: "phone",
      type: "tel",
      label: "شماره موبایل",
      colSpan: 6,
      mask: "phone",
      placeholder: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
    },
    {
      name: "role",
      type: "select",
      label: "نقش",
      colSpan: 6,
      options: [
        { label: "مدیر", value: "admin" },
        { label: "ویرایشگر", value: "editor" },
        { label: "بیننده", value: "viewer" },
      ],
    },
    {
      name: "active",
      type: "switch",
      label: "حساب فعال",
      defaultValue: true,
    },
  ],
};
```

### ۲. رندر با `RavenForm`

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

export function UserForm() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log("ارسال شد:", values);
  };

  return (
    <RavenForm
      schema={schema}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={handleSubmit}
      submitLabel="ذخیره کاربر"
    />
  );
}
```

همین — Raven Form یک فرم با اعتبارسنجی و گرید واکنش‌گرا ۱۲ ستونی رندر می‌کند.

---

## تنظیم سراسری با `RavenFormProvider`

به جای ارسال `adapter` و `ui` در هر کامپوننت `<RavenForm>`، یک بار کل برنامه را با `<RavenFormProvider>` بپوشانید:

```tsx
// main.tsx (یا ریشه App)
import { RavenFormProvider } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RavenFormProvider formAdapter={RHFAdapter} uiAdapter={ShadCNUIAdapter}>
    <App />
  </RavenFormProvider>,
);
```

هر کامپوننت `<RavenForm>`، `<RavenWizardForm>` یا `<RavenRepeaterField>` درون Provider به صورت خودکار آداپتورها را به ارث می‌برد:

```tsx
// UserForm.tsx — نیازی به adapter یا ui نیست
import { RavenForm } from "raven-form";

export function UserForm() {
  return (
    <RavenForm
      schema={schema}
      onSubmit={handleSubmit}
      submitLabel="ذخیره کاربر"
    />
  );
}
```

> **لغو برای یک فرم خاص:** می‌توانید همچنان `adapter` یا `ui` را مستقیم روی هر فرم بگذارید تا مقدار Provider برای آن فرم لغو شود.

---

## Props کامپوننت RavenForm

| Prop                 | نوع                                 | الزامی | توضیح                                |
| -------------------- | ----------------------------------- | ------ | ------------------------------------ |
| `schema`             | `FormSchema`                        | ✅     | تعریف فیلدها و تنظیمات چینش          |
| `adapter`            | `FormAdapter`                       | ✅     | آداپتور کتابخانه مدیریت فرم          |
| `ui`                 | `UIAdapter`                         | ✅     | آداپتور کتابخانه کامپوننت UI         |
| `onSubmit`           | `(values) => void \| Promise<void>` | ✅     | تابع فراخوانده‌شده هنگام ارسال       |
| `defaultValues`      | `Record<string, unknown>`           | —      | مقادیر پیش‌فرض در زمان اجرا          |
| `submitLabel`        | `string`                            | —      | متن دکمه ارسال (پیش‌فرض: `"Submit"`) |
| `showStateInspector` | `boolean`                           | —      | نمایش پنل دیباگ حالت فرم             |

---

## ساختار FormSchema

```ts
interface FormSchema {
  fields: FormField[]; // تعریف فیلدها
  columns?: number; // تعداد ستون‌های گرید (پیش‌فرض: ۱۲)
  gap?: string; // کلاس فاصله مثل "gap-4"
  steps?: WizardStep[]; // مراحل Wizard — برای RavenWizard
}
```

---

## گام‌های بعدی

- [انواع فیلد](/fa/guide/field-types) — بیش از ۲۵ نوع فیلد پشتیبانی شده
- [اعتبارسنجی](/fa/guide/validation) — sync، async، pattern، بین‌فیلدی
- [آداپتورهای فرم](/fa/guide/adapters) — RHF، AntD، سفارشی
- [آداپتورهای UI](/fa/guide/ui-adapters) — ShadCN، AntD، سفارشی
- [فرم‌های Wizard](/fa/guide/wizard) — فرم‌های چندمرحله‌ای
- [فیلدهای تکرارشونده](/fa/guide/repeater) — آرایه‌های پویای ردیف
