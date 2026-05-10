# آداپتورهای فرم

معماری Raven Form بر پایه **آداپتور** بنا شده است. آداپتور لایه‌ای است که کتابخانه مدیریت فرم (مثل RHF یا Formik) را به engine متصل می‌کند.

## رابط FormAdapter

```ts
interface FormAdapter {
  FormProvider: React.FC<{ schema: FormSchema; children: ReactNode }>;
  useField: (name: string, schema: FormSchema) => FieldBinding;
  useSubmit: (
    schema: FormSchema,
    onSubmit: (v: Record<string, unknown>) => void,
  ) => () => void;
  useWatch: (name: string) => unknown;
  useTrigger?: (name: string) => () => Promise<boolean>;
}
```

---

## آداپتورهای موجود

| آداپتور         | کتابخانه          | مناسب برای                              |
| --------------- | ----------------- | --------------------------------------- |
| `rhfAdapter`    | `react-hook-form` | اغلب پروژه‌ها — عملکرد بالا             |
| `antdAdapter`   | حالت داخلی React  | پروژه‌های ساده / آموزشی                 |
| `FormikAdapter` | `formik`          | پروژه‌هایی که از Formik استفاده می‌کنند |
| آداپتور سفارشی  | هر چیزی           | نیازهای ویژه                            |

---

## انتخاب آداپتور

```tsx
import { RavenForm } from '@/form-engine'
import { rhfAdapter } from '@/form-engine/adapters/rhfAdapter'

<RavenForm schema={schema} adapter={rhfAdapter} onSubmit={...} />
```

آداپتور را یک بار در بالاترین سطح تنظیم کنید و در همه فرم‌هایتان استفاده کنید.

---

## آداپتور پیش‌فرض

می‌توانید یک آداپتور پیش‌فرض در provider سطح بالای اپلیکیشن تنظیم کنید:

```tsx
// main.tsx
import { FormEngineProvider } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";

<FormEngineProvider adapter={rhfAdapter}>
  <App />
</FormEngineProvider>;
```

پس از آن، `RavenForm` بدون prop `adapter` هم کار می‌کند.

---

## لینک‌های بیشتر

- [آداپتور React Hook Form](/fa/guide/rhf)
- [آداپتور Formik](/fa/guide/formik)
- [ساخت آداپتور سفارشی](/fa/guide/custom-adapter)

---

## استفاده از `createFormAdapter`

`createFormAdapter` آداپتور شما را در هنگام ساخت اعتبارسنجی می‌کند:

```ts
import { createFormAdapter } from 'raven-form'

const myAdapter = createFormAdapter({
  Provider: MyFormProvider,
  useField: (name) => ({ value, onChange, onBlur, error }),
  useSubmit: () => () => myForm.handleSubmit(),
  useWatch: (names?) => ({ field1: value1 }),
  useTrigger: () => async (names) => await myForm.trigger(names), // اختیاری
})
```
