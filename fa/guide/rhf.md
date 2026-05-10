# آداپتور React Hook Form

`rhfAdapter` از [React Hook Form](https://react-hook-form.com) استفاده می‌کند — کارآمدترین کتابخانه فرم برای React.

## نصب

```bash
npm install react-hook-form
```

## استفاده پایه

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";

const schema = {
  id: "login",
  fields: [
    {
      name: "email",
      type: "email",
      label: "ایمیل",
      validation: { required: true },
    },
    {
      name: "password",
      type: "password",
      label: "رمز عبور",
      validation: { required: true },
    },
  ],
};

export function LoginForm() {
  return (
    <RavenForm
      schema={schema}
      adapter={rhfAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ورود"
    />
  );
}
```

---

## مثال کامل: فرم ثبت‌نام

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";
import type { FormSchema } from "@/form-engine/types";

const registrationSchema: FormSchema = {
  id: "registration",
  columns: 12,
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "نام",
      colSpan: 6,
      validation: { required: true },
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
      label: "ایمیل",
      colSpan: 12,
      validation: {
        required: "ایمیل اجباری است",
        validate: async (v) => {
          const res = await fetch(`/api/check-email?email=${v}`);
          return res.ok ? true : "این ایمیل قبلاً ثبت شده";
        },
      },
    },
    { name: "phone", type: "tel", label: "موبایل", colSpan: 6, mask: "phone" },
    {
      name: "password",
      type: "password",
      label: "رمز عبور",
      colSpan: 6,
      validation: {
        required: true,
        minLength: { value: 8, message: "حداقل ۸ کاراکتر" },
      },
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
    {
      name: "accountType",
      type: "radio",
      label: "نوع حساب",
      colSpan: 12,
      defaultValue: "personal",
      options: [
        { label: "شخصی", value: "personal" },
        { label: "تجاری", value: "business" },
      ],
    },
    {
      name: "companyName",
      type: "text",
      label: "نام شرکت",
      colSpan: 12,
      hidden: (v) => v.accountType !== "business",
      dependsOn: ["accountType"],
      validation: {
        validate: (v, all) =>
          all.accountType !== "business" || !!v || "نام شرکت اجباری است",
      },
    },
    {
      name: "agree",
      type: "checkbox",
      label: "قوانین و مقررات را می‌پذیرم",
      colSpan: 12,
      validation: { required: "باید قوانین را بپذیرید" },
    },
  ],
};

export function RegistrationPage() {
  return (
    <RavenForm
      schema={registrationSchema}
      adapter={rhfAdapter}
      onSubmit={async (data) => {
        await fetch("/api/register", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }}
      submitLabel="ثبت‌نام"
    />
  );
}
```

---

## ویژگی‌های کلیدی

| ویژگی                | توضیح                                    |
| -------------------- | ---------------------------------------- |
| بدون re-render اضافه | فیلدها به صورت uncontrolled رندر می‌شوند |
| اعتبارسنجی async     | با `validate` async کار می‌کند           |
| `useTrigger`         | اعتبارسنجی دستی فیلد خاص                 |
| `useWatch`           | مشاهده مقادیر برای فیلدهای شرطی          |
| `showStateInspector` | دیباگ مقادیر فرم در توسعه                |

---

## دیباگ حالت فرم

```tsx
<RavenForm
  schema={schema}
  adapter={rhfAdapter}
  onSubmit={...}
  showStateInspector // فقط در محیط توسعه
/>
```
