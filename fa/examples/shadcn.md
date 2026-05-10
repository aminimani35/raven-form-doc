# مثال‌های ShadCN/ui

نمونه‌های کامل استفاده از Raven Form با کامپوننت‌های [shadcn/ui](https://ui.shadcn.com/).

## پیش‌نیازها

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add input label select textarea switch button
npm install react-hook-form
```

---

## مثال ۱: فرم ثبت‌نام

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";
import { ShadCNUIAdapter } from "@/form-engine/ui/shadcnAdapter";

const signupSchema = {
  id: "signup",
  columns: 12,
  fields: [
    {
      name: "name",
      type: "text",
      label: "نام کامل",
      colSpan: 12,
      validation: { required: true },
    },
    {
      name: "email",
      type: "email",
      label: "ایمیل",
      colSpan: 12,
      validation: {
        required: true,
        validate: async (v) => {
          const res = await fetch(`/api/check-email?email=${v}`);
          return res.ok ? true : "این ایمیل قبلاً ثبت شده";
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
      label: "تکرار رمز",
      colSpan: 6,
      validation: {
        deps: ["password"],
        validate: (v, all) => v === all.password || "رمزها یکسان نیستند",
      },
    },
    {
      name: "terms",
      type: "checkbox",
      label: "قوانین را می‌پذیرم",
      colSpan: 12,
      validation: { required: "پذیرش قوانین اجباری است" },
    },
  ],
};

export function SignupForm() {
  return (
    <div className="max-w-md mx-auto p-6 rounded-xl border shadow-sm">
      <h2 className="text-2xl font-bold mb-6">ایجاد حساب کاربری</h2>
      <RavenForm
        schema={signupSchema}
        adapter={rhfAdapter}
        uiAdapter={ShadCNUIAdapter}
        onSubmit={(data) => console.log(data)}
        submitLabel="ثبت‌نام"
      />
    </div>
  );
}
```

---

## مثال ۲: صفحه تنظیمات

```tsx
const settingsSchema = {
  id: "settings",
  columns: 12,
  fields: [
    { name: "displayName", type: "text", label: "نام نمایشی", colSpan: 12 },
    { name: "bio", type: "textarea", label: "بیوگرافی", colSpan: 12 },
    {
      name: "language",
      type: "select",
      label: "زبان",
      colSpan: 6,
      options: [
        { label: "فارسی", value: "fa" },
        { label: "English", value: "en" },
        { label: "العربية", value: "ar" },
      ],
    },
    {
      name: "theme",
      type: "radio",
      label: "پوسته",
      colSpan: 6,
      options: [
        { label: "روشن", value: "light" },
        { label: "تاریک", value: "dark" },
        { label: "سیستم", value: "system" },
      ],
    },
    {
      name: "emailNotif",
      type: "switch",
      label: "اعلان ایمیل",
      colSpan: 6,
      defaultValue: true,
    },
    {
      name: "pushNotif",
      type: "switch",
      label: "اعلان push",
      colSpan: 6,
      defaultValue: false,
    },
    {
      name: "weeklyReport",
      type: "switch",
      label: "گزارش هفتگی",
      colSpan: 6,
      defaultValue: true,
    },
  ],
};

export function SettingsForm() {
  return (
    <RavenForm
      schema={settingsSchema}
      adapter={rhfAdapter}
      uiAdapter={ShadCNUIAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ذخیره تنظیمات"
    />
  );
}
```

---

## مثال ۳: سازنده فاکتور (Repeater)

```tsx
const invoiceSchema = {
  id: "invoice",
  columns: 12,
  fields: [
    {
      name: "clientName",
      type: "text",
      label: "نام مشتری",
      colSpan: 6,
      validation: { required: true },
    },
    { name: "invoiceDate", type: "date", label: "تاریخ", colSpan: 6 },
    {
      name: "items",
      type: "repeater",
      label: "آیتم‌های فاکتور",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        addLabel: "+ افزودن آیتم",
        fields: [
          { name: "description", type: "text", label: "شرح", colSpan: 6 },
          {
            name: "qty",
            type: "number",
            label: "تعداد",
            colSpan: 2,
            defaultValue: 1,
          },
          {
            name: "unitPrice",
            type: "number",
            label: "قیمت واحد",
            colSpan: 4,
            formatter: "currency",
          },
        ],
      },
    },
    { name: "notes", type: "textarea", label: "توضیحات", colSpan: 12 },
  ],
};
```

---

## مثال ۴: فرم بازخورد

```tsx
const feedbackSchema = {
  id: "feedback",
  columns: 12,
  fields: [
    {
      name: "subject",
      type: "text",
      label: "موضوع",
      colSpan: 12,
      validation: { required: true },
    },
    { name: "rating", type: "rating", label: "امتیاز", colSpan: 12 },
    {
      name: "nps",
      type: "range",
      label: "احتمال معرفی (۰–۱۰)",
      colSpan: 12,
      validation: { min: 0, max: 10 },
      defaultValue: 7,
    },
    { name: "brandColor", type: "color", label: "رنگ پیشنهادی", colSpan: 6 },
    {
      name: "message",
      type: "textarea",
      label: "پیام",
      colSpan: 12,
      validation: { required: true },
    },
  ],
};

export function FeedbackForm() {
  return (
    <RavenForm
      schema={feedbackSchema}
      adapter={rhfAdapter}
      uiAdapter={ShadCNUIAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ارسال بازخورد"
    />
  );
}
```
