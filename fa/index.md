---
layout: home
dir: rtl

hero:
  name: "Raven Form"
  text: "اسکیما-محور. مستقل از UI. آماده‌ی تولید."
  tagline: با توصیف فرم‌هایت به جای نوشتن کد تکراری، در وقتت صرفه‌جویی کن. هر کتابخانه‌ی UI و هر کتابخانه‌ی مدیریت فرم را به دلخواه وصل کن.
  image:
    src: /logo.svg
    alt: Raven Form Logo
  actions:
    - theme: brand
      text: شروع سریع ←
      link: /fa/getting-started
    - theme: alt
      text: مشاهده در GitHub
      link: https://github.com/aminimani35/raven-form.git
    - theme: alt
      text: مرجع API
      link: /fa/api/smart-form

features:
  - icon: 🧩
    title: API اسکیما-محور
    details: کل فرمت را به صورت یک شیء JavaScript ساده تعریف کن — نوع فیلد، برچسب، قوانین اعتبارسنجی، چینش گرید، و منطق شرطی — همه در یک جا.
    link: /fa/getting-started
    linkText: مشاهده اسکیما

  - icon: 🔌
    title: معماری آداپتور
    details: Raven Form به هیچ کتابخانه فرم یا UI وابسته نیست. React Hook Form، Ant Design Form، یا آداپتور سفارشی خودت را در چند دقیقه وصل کن.
    link: /fa/guide/adapters
    linkText: بررسی آداپتورها

  - icon: 🎨
    title: رندرینگ مستقل از UI
    details: با ShadCN/ui، Ant Design، یا هر کتابخانه کامپوننت دیگری کار می‌کند. UIAdapter آماده برای هر دو موجود است یا می‌توانی خودت بسازی.
    link: /fa/guide/ui-adapters
    linkText: آداپتورهای UI

  - icon: 🧭
    title: فرم چندمرحله‌ای (Wizard)
    details: هر اسکیمایی را به یک فرم راهنما تبدیل کن. RavenWizard پیشرفت مرحله، اعتبارسنجی هر مرحله، و ناوبری را خودکار مدیریت می‌کند.
    link: /fa/guide/wizard
    linkText: ساخت Wizard

  - icon: 🔁
    title: فیلدهای تکرارشونده
    details: بگذار کاربران ردیف‌های فیلد زیر را در زمان اجرا اضافه و حذف کنند. حداقل/حداکثر ردیف، مقادیر پیش‌فرض ردیف، و اعتبارسنجی کامل تودرتو.
    link: /fa/guide/repeater
    linkText: استفاده از Repeater

  - icon: ✅
    title: اعتبارسنجی غنی
    details: اعتبارسنج sync و async، min/max، pattern، required، و validator سفارشی بین فیلدها — همه در یک interface یکپارچه.
    link: /fa/guide/validation
    linkText: مستندات اعتبارسنجی

  - icon: 🎭
    title: بیش از ۲۵ نوع فیلد
    details: text، email، tel، url، number، password، textarea، date، time، datetime، select، multiselect، radio، checkbox، switch، otp، file، range، color، rating، repeater، و custom.
    link: /fa/guide/field-types
    linkText: همه نوع‌ها

  - icon: 🔡
    title: Mask ورودی
    details: Mask آماده برای موبایل، کارت بانکی، IBAN، کد ملی، کد پستی، OTP، و ارز — یا تابع Mask سفارشی خودت را تعریف کن.
    link: /fa/guide/masks
    linkText: راهنمای Mask

  - icon: 🔄
    title: فرمتر و پارسر
    details: مقادیر ورودی را به دلخواه تبدیل کن. از فرمتر آماده (currency، titleCase، trim، upper، lower) استفاده کن یا خودت ثبت کن.
    link: /fa/guide/formatters
    linkText: راهنمای فرمتر

  - icon: 👁️
    title: فیلدهای شرطی
    details: هر فیلد را بر اساس وضعیت فرم نمایش داده، مخفی، فعال، یا غیرفعال کن — با predicateهای تابعی تمیز.
    link: /fa/guide/field-types
    linkText: منطق شرطی

  - icon: 📐
    title: سیستم گرید ۱۲ ستونی
    details: هر فیلد colSpan دارد (۱–۱۲) که به یک گرید CSS واکنش‌گرا ۱۲ ستونی نگاشت می‌شود.
    link: /fa/getting-started
    linkText: مستندات چینش

  - icon: 🛠️
    title: فیلد سفارشی
    details: برای فیلدی که با هیچ نوع موجودی جور نمی‌شود، از type="custom" با تابع render استفاده کن.
    link: /fa/guide/custom-fields
    linkText: فیلدهای سفارشی
---

<div class="landing-demo" dir="rtl">

## مثال ساده — از اسکیما تا فرم در چند ثانیه

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const schema = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "نام و نام خانوادگی",
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
    { name: "bio", type: "textarea", label: "درباره من", colSpan: 12 },
    { name: "active", type: "switch", label: "حساب فعال" },
  ],
};

export function MyForm() {
  return (
    <RavenForm
      schema={schema}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={(values) => console.log(values)}
      submitLabel="ذخیره"
    />
  );
}
```

</div>
