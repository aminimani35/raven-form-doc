# API — RavenForm

`RavenForm` کامپوننت اصلی Raven Form است.

## Props

| نام                  | نوع                                 | پیش‌فرض         | توضیح                           |
| -------------------- | ----------------------------------- | --------------- | ------------------------------- |
| `schema`             | `FormSchema`                        | —               | **اجباری.** اسکیمای فرم         |
| `adapter`            | `FormAdapter`                       | —               | **اجباری.** آداپتور مدیریت حالت |
| `uiAdapter`          | `UIAdapter`                         | آداپتور پیش‌فرض | آداپتور رندر کامپوننت‌های UI    |
| `onSubmit`           | `(values) => void \| Promise<void>` | —               | **اجباری.** تابع submit         |
| `defaultValues`      | `Record<string, unknown>`           | `{}`            | مقادیر اولیه (بازنویسی اسکیما)  |
| `submitLabel`        | `string`                            | `"Submit"`      | برچسب دکمه submit               |
| `submitButtonProps`  | `ButtonProps`                       | `{}`            | props اضافه به دکمه submit      |
| `showStateInspector` | `boolean`                           | `false`         | نمایش دیباگر مقادیر (فقط توسعه) |
| `className`          | `string`                            | `""`            | کلاس CSS کانتینر                |
| `style`              | `CSSProperties`                     | `{}`            | استایل inline کانتینر           |
| `disabled`           | `boolean`                           | `false`         | غیرفعال کردن کل فرم             |
| `loading`            | `boolean`                           | `false`         | نمایش حالت loading هنگام submit |
| `onChange`           | `(values) => void`                  | —               | فراخوانی هنگام تغییر هر فیلد    |

## مثال

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";
import { AntDUIAdapter } from "@/form-engine/ui/antdAdapter";

<RavenForm
  schema={schema}
  adapter={rhfAdapter}
  uiAdapter={AntDUIAdapter}
  onSubmit={async (values) => {
    await api.saveForm(values);
  }}
  defaultValues={{ country: "IR" }}
  submitLabel="ذخیره"
  loading={isSaving}
  showStateInspector={process.env.NODE_ENV === "development"}
/>;
```

## FormSchema

```ts
interface FormSchema {
  id: string;
  columns?: number; // تعداد ستون‌ها (پیش‌فرض: ۱۲)
  fields: FormField[];
  messages?: Record<string, string>; // پیام‌های خطای سفارشی
}
```
