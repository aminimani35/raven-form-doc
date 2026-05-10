# اعتبارسنجی

Raven Form یک سیستم اعتبارسنجی یکپارچه ارائه می‌دهد که برای تمام آداپتورها (RHF، Formik و ...) یکسان عمل می‌کند.

## رابط FieldValidation

```ts
interface FieldValidation {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (
    value: unknown,
    allValues: Record<string, unknown>,
  ) => string | true | Promise<string | true>;
  deps?: string[];
}
```

---

## قوانین پایه

### `required`

```ts
{ name: 'email', type: 'email', label: 'ایمیل', validation: { required: 'ایمیل اجباری است' } }
```

### `minLength` / `maxLength`

```ts
{ name: 'username', type: 'text', label: 'نام کاربری', validation: { minLength: 3, maxLength: 30 } }
// یا با پیام سفارشی:
validation: { minLength: { value: 3, message: 'حداقل ۳ کاراکتر وارد کنید' } }
```

### `min` / `max` برای اعداد

```ts
{ name: 'age', type: 'number', label: 'سن', validation: { min: 18, max: 100 } }
```

### `pattern` — الگوی regex

```ts
{
  name: 'iban',
  type: 'text',
  label: 'شماره IBAN',
  validation: {
    pattern: {
      value: /^IR\d{24}$/,
      message: 'فرمت IBAN معتبر نیست'
    }
  }
}
```

---

## اعتبارسنجی سفارشی

تابع `validate` می‌تواند هم‌زمان یا غیرهم‌زمان باشد:

```ts
{
  name: 'username',
  type: 'text',
  label: 'نام کاربری',
  validation: {
    validate: async (value) => {
      const isTaken = await checkUsernameTaken(value as string)
      return isTaken ? 'این نام کاربری قبلاً ثبت شده' : true
    }
  }
}
```

---

## اعتبارسنجی وابسته به فیلدهای دیگر

برای اعتبارسنجی که به مقدار فیلد دیگری نیاز دارد، از `deps` استفاده کنید:

```ts
{
  name: 'confirmPassword',
  type: 'password',
  label: 'تکرار رمز عبور',
  validation: {
    deps: ['password'],
    validate: (value, all) =>
      value === all.password || 'رمز عبور و تکرار آن یکسان نیستند'
  }
}
```

---

## اعتبارسنجی در سطح اسکیما

می‌توانید `onSubmit` را برای اعتبارسنجی کلی فرم به `RavenForm` ارسال کنید:

```tsx
<RavenForm
  schema={schema}
  adapter={rhfAdapter}
  onSubmit={async (values) => {
    const errs = await serverValidate(values);
    if (errs) throw errs; // خطاها را به فرم برمی‌گردانیم
    await submitData(values);
  }}
/>
```

---

## پیام‌های خطای پیش‌فرض (بین‌المللی‌سازی)

پیام خطای پیش‌فرض را می‌توانید از طریق `schema.messages` تنظیم کنید:

```ts
const schema: FormSchema = {
  id: 'signup',
  messages: {
    required:  'این فیلد اجباری است',
    minLength: 'حداقل {min} کاراکتر وارد کنید',
    maxLength: 'حداکثر {max} کاراکتر مجاز است',
    pattern:   'فرمت وارد‌شده معتبر نیست',
  },
  fields: [...],
}
```

---

## مثال: فرم ثبت‌نام با اعتبارسنجی کامل

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";

const schema = {
  id: "register",
  fields: [
    {
      name: "email",
      type: "email",
      label: "ایمیل",
      colSpan: 12,
      validation: {
        required: "ایمیل اجباری است",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "ایمیل معتبر نیست",
        },
        validate: async (v) => {
          const r = await fetch(`/api/email-check?email=${v}`);
          return r.ok ? true : "این ایمیل قبلاً ثبت شده";
        },
      },
    },
    {
      name: "password",
      type: "password",
      label: "رمز عبور",
      colSpan: 6,
      validation: { required: true, minLength: 8 },
    },
    {
      name: "confirm",
      type: "password",
      label: "تکرار رمز عبور",
      colSpan: 6,
      validation: {
        deps: ["password"],
        validate: (v, all) => v === all.password || "رمزها یکسان نیستند",
      },
    },
  ],
};

export function RegisterForm() {
  return (
    <RavenForm
      schema={schema}
      adapter={rhfAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ثبت‌نام"
    />
  );
}
```
