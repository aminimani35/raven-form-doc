# API — RavenWizard

`RavenWizard` فرم چند مرحله‌ای (Wizard) را اجرا می‌کند.

## Props

| نام             | نوع                                 | پیش‌فرض    | توضیح                         |
| --------------- | ----------------------------------- | ---------- | ----------------------------- |
| `steps`         | `WizardStep[]`                      | —          | **اجباری.** آرایه مراحل       |
| `adapter`       | `FormAdapter`                       | —          | **اجباری.** آداپتور فرم       |
| `uiAdapter`     | `UIAdapter`                         | —          | آداپتور UI                    |
| `onSubmit`      | `(values) => void \| Promise<void>` | —          | **اجباری.** تابع submit نهایی |
| `submitLabel`   | `string`                            | `"Submit"` | برچسب دکمه submit             |
| `nextLabel`     | `string`                            | `"Next"`   | برچسب دکمه مرحله بعد          |
| `prevLabel`     | `string`                            | `"Back"`   | برچسب دکمه مرحله قبل          |
| `showStepCount` | `boolean`                           | `true`     | نمایش `مرحله X از Y`          |
| `onStepChange`  | `(step: number) => void`            | —          | فراخوانی هنگام تغییر مرحله    |
| `defaultValues` | `Record<string, unknown>`           | `{}`       | مقادیر اولیه                  |
| `className`     | `string`                            | `""`       | کلاس CSS کانتینر              |

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

## مثال

```tsx
import { RavenWizardForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";

<RavenWizardForm
  steps={[
    {
      id: "step1",
      title: "مرحله اول",
      fields: [
        {
          name: "name",
          type: "text",
          label: "نام",
          validation: { required: true },
        },
      ],
      onNext: async (values) => {
        // اعتبارسنجی سفارشی قبل از رفتن به مرحله بعد
        const ok = await validateStep1(values);
        return ok;
      },
    },
    {
      id: "step2",
      title: "مرحله دوم",
      fields: [
        {
          name: "email",
          type: "email",
          label: "ایمیل",
          validation: { required: true },
        },
      ],
    },
  ]}
  adapter={rhfAdapter}
  onSubmit={(data) => console.log(data)}
  submitLabel="تکمیل"
  nextLabel="بعدی"
  prevLabel="قبلی"
/>;
```
