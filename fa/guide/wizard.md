# فرم چندمرحله‌ای (Wizard)

`RavenWizard` یک رابط چند مرحله‌ای (step-by-step) برای فرم‌های پیچیده ارائه می‌دهد.

## نصب

`RavenWizard` بخشی از `form-engine` است — نیاز به نصب جداگانه ندارد.

## ساختار WizardStep

```ts
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}
```

## مثال: فرم ثبت شرکت (۳ مرحله)

```tsx
import { RavenWizardForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";

const steps = [
  {
    id: "company",
    title: "اطلاعات شرکت",
    description: "مشخصات کلی شرکت را وارد کنید",
    fields: [
      {
        name: "companyName",
        type: "text",
        label: "نام شرکت",
        colSpan: 12,
        validation: { required: true },
      },
      {
        name: "industry",
        type: "select",
        label: "صنعت",
        colSpan: 6,
        options: [
          { label: "فناوری", value: "tech" },
          { label: "مالی", value: "finance" },
          { label: "سلامت", value: "health" },
        ],
      },
      {
        name: "size",
        type: "radio",
        label: "اندازه شرکت",
        colSpan: 6,
        options: [
          { label: "۱–۱۰", value: "small" },
          { label: "۱۱–۵۰", value: "medium" },
          { label: "۵۰+", value: "large" },
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "حساب مدیر",
    description: "اطلاعات مدیر سیستم را وارد کنید",
    fields: [
      {
        name: "adminName",
        type: "text",
        label: "نام",
        colSpan: 6,
        validation: { required: true },
      },
      {
        name: "adminEmail",
        type: "email",
        label: "ایمیل",
        colSpan: 6,
        validation: { required: true },
      },
      {
        name: "adminPass",
        type: "password",
        label: "رمز عبور",
        colSpan: 12,
        validation: { required: true, minLength: 8 },
      },
    ],
  },
  {
    id: "plan",
    title: "انتخاب پلن",
    description: "پلن مناسب کسب‌وکارتان را انتخاب کنید",
    fields: [
      {
        name: "plan",
        type: "radio",
        label: "پلن",
        colSpan: 12,
        options: [
          { label: "رایگان", value: "free" },
          { label: "حرفه‌ای", value: "pro" },
          { label: "سازمانی", value: "enterprise" },
        ],
      },
      { name: "coupon", type: "text", label: "کد تخفیف (اختیاری)", colSpan: 6 },
    ],
  },
];

export function OnboardingWizard() {
  return (
    <RavenWizardForm
      steps={steps}
      adapter={rhfAdapter}
      onSubmit={async (data) => {
        await fetch("/api/register-company", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }}
      submitLabel="تکمیل ثبت‌نام"
      nextLabel="مرحله بعد"
      prevLabel="مرحله قبل"
    />
  );
}
```

## Props

| نام             | نوع                | توضیح             |
| --------------- | ------------------ | ----------------- |
| `steps`         | `WizardStep[]`     | آرایه مراحل       |
| `adapter`       | `FormAdapter`      | آداپتور فرم       |
| `onSubmit`      | `(values) => void` | تابع submit نهایی |
| `submitLabel`   | `string`           | برچسب دکمه submit |
| `nextLabel`     | `string`           | برچسب دکمه بعدی   |
| `prevLabel`     | `string`           | برچسب دکمه قبلی   |
| `showStepCount` | `boolean`          | نمایش شماره مرحله |
