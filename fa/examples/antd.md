# مثال‌های Ant Design

نمونه‌های کامل استفاده از Raven Form با کامپوننت‌های [Ant Design](https://ant.design/).

## پیش‌نیازها

```bash
npm install antd react-hook-form
```

---

## مثال ۱: فرم ورود

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";
import { AntDUIAdapter } from "@/form-engine/ui/antdAdapter";
import { Card } from "antd";

const loginSchema = {
  id: "login",
  fields: [
    {
      name: "email",
      type: "email",
      label: "ایمیل",
      colSpan: 12,
      validation: { required: true },
    },
    {
      name: "password",
      type: "password",
      label: "رمز عبور",
      colSpan: 12,
      validation: { required: true },
    },
    {
      name: "remember",
      type: "switch",
      label: "مرا به خاطر بسپار",
      colSpan: 12,
    },
  ],
};

export function AntDLoginForm() {
  return (
    <Card title="ورود به سیستم" style={{ maxWidth: 420, margin: "auto" }}>
      <RavenForm
        schema={loginSchema}
        adapter={rhfAdapter}
        uiAdapter={AntDUIAdapter}
        onSubmit={(data) => console.log(data)}
        submitLabel="ورود"
      />
    </Card>
  );
}
```

---

## مثال ۲: پروفایل کارمند

```tsx
const employeeSchema = {
  id: "employee",
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
      colSpan: 6,
      validation: { required: true },
    },
    { name: "phone", type: "tel", label: "موبایل", colSpan: 6, mask: "phone" },
    {
      name: "department",
      type: "select",
      label: "دپارتمان",
      colSpan: 6,
      options: [
        { label: "فناوری", value: "tech" },
        { label: "مالی", value: "finance" },
        { label: "منابع انسانی", value: "hr" },
        { label: "بازاریابی", value: "marketing" },
      ],
    },
    {
      name: "salary",
      type: "number",
      label: "حقوق (تومان)",
      colSpan: 6,
      formatter: "currency",
    },
    {
      name: "skills",
      type: "multiselect",
      label: "مهارت‌ها",
      colSpan: 12,
      options: [
        { label: "React", value: "react" },
        { label: "TypeScript", value: "ts" },
        { label: "Node.js", value: "node" },
        { label: "Python", value: "python" },
        { label: "SQL", value: "sql" },
      ],
    },
    {
      name: "active",
      type: "switch",
      label: "کارمند فعال",
      colSpan: 6,
      defaultValue: true,
    },
    { name: "bio", type: "textarea", label: "بیوگرافی", colSpan: 12 },
  ],
};

export function EmployeeProfileForm() {
  return (
    <RavenForm
      schema={employeeSchema}
      adapter={rhfAdapter}
      uiAdapter={AntDUIAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ذخیره پروفایل"
    />
  );
}
```

---

## مثال ۳: Wizard چند مرحله‌ای

```tsx
import { RavenWizardForm } from "@/form-engine";

const onboardingSteps = [
  {
    id: "company",
    title: "اطلاعات شرکت",
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
        label: "حوزه فعالیت",
        colSpan: 6,
        options: [
          { label: "فناوری", value: "tech" },
          { label: "سلامت", value: "health" },
          { label: "آموزش", value: "education" },
        ],
      },
    ],
  },
  {
    id: "admin",
    title: "حساب مدیر",
    fields: [
      {
        name: "adminEmail",
        type: "email",
        label: "ایمیل مدیر",
        colSpan: 12,
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
];

export function OnboardingWizard() {
  return (
    <RavenWizardForm
      steps={onboardingSteps}
      adapter={rhfAdapter}
      uiAdapter={AntDUIAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="شروع کنید"
      nextLabel="بعدی"
      prevLabel="قبلی"
    />
  );
}
```

---

## مثال ۴: مخاطبات پویا (Repeater)

```tsx
const contactsSchema = {
  id: "contacts",
  fields: [
    {
      name: "contacts",
      type: "repeater",
      label: "مخاطبان",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        maxRows: 10,
        addLabel: "+ افزودن مخاطب",
        fields: [
          { name: "name", type: "text", label: "نام", colSpan: 5 },
          { name: "email", type: "email", label: "ایمیل", colSpan: 5 },
          {
            name: "role",
            type: "select",
            label: "نقش",
            colSpan: 2,
            options: [
              { label: "مدیر", value: "admin" },
              { label: "کاربر", value: "user" },
              { label: "مهمان", value: "guest" },
            ],
          },
        ],
      },
    },
  ],
};

export function ContactsForm() {
  return (
    <RavenForm
      schema={contactsSchema}
      adapter={rhfAdapter}
      uiAdapter={AntDUIAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ذخیره"
    />
  );
}
```
