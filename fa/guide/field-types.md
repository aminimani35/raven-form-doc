# انواع فیلد

Raven Form از **بیش از ۲۵ نوع فیلد** به صورت آماده پشتیبانی می‌کند. هر فیلد توسط یک شیء `FormField` در آرایه `fields` اسکیماتان توصیف می‌شود.

## خواص مشترک FormField

| خاصیت            | نوع                              | توضیح                                   |
| ---------------- | -------------------------------- | --------------------------------------- |
| `name`           | `string`                         | شناسه یکتای فیلد (کلید مقدار در فرم)    |
| `type`           | `FieldType`                      | نوع فیلد (لیست زیر)                     |
| `label`          | `string`                         | برچسب قابل خواندن توسط انسان            |
| `placeholder`    | `string`                         | متن placeholder                         |
| `description`    | `string`                         | متن کمکی زیر فیلد                       |
| `defaultValue`   | `T`                              | مقدار اولیه                             |
| `colSpan`        | `۱–۱۲`                           | تعداد ستون‌های اشغال‌شده (پیش‌فرض: ۶)   |
| `disabled`       | `boolean \| (values) => boolean` | حالت غیرفعال ثابت یا پویا               |
| `hidden`         | `boolean \| (values) => boolean` | نمایش ثابت یا پویا                      |
| `validation`     | `FieldValidation`                | قوانین اعتبارسنجی                       |
| `mask`           | `string \| (v) => string`        | تابع Mask یا کلید رجیستری               |
| `formatter`      | `string \| (v) => unknown`       | تبدیل مقدار هنگام تغییر                 |
| `parser`         | `string \| (v) => T`             | تبدیل مقدار ذخیره‌شده به نمایش          |
| `options`        | `Option[]`                       | گزینه‌ها برای select/radio/multiselect  |
| `dependsOn`      | `string[]`                       | نام فیلدهایی که باید مشاهده شوند        |
| `render`         | `(ctx) => ReactNode`             | تابع رندر سفارشی (`type: "custom"`)     |
| `componentProps` | `Record<string, unknown>`        | props اضافه به کامپوننت زیرین           |
| `repeaterConfig` | `RepeaterConfig`                 | تنظیمات برای فیلدهای `type: "repeater"` |

---

## ورودی‌های متنی

### `text` — متن ساده

```ts
{ name: 'username', type: 'text', label: 'نام کاربری', colSpan: 6 }
```

### `email` — ایمیل

```ts
{ name: 'email', type: 'email', label: 'ایمیل', validation: { required: true } }
```

### `tel` — تلفن

```ts
{ name: 'phone', type: 'tel', label: 'موبایل', mask: 'phone' }
```

### `url` — آدرس اینترنتی

```ts
{ name: 'website', type: 'url', label: 'وبسایت' }
```

### `number` — عدد

```ts
{ name: 'age', type: 'number', label: 'سن', validation: { min: 18, max: 120 } }
```

### `password` — رمز عبور

```ts
{ name: 'password', type: 'password', label: 'رمز عبور', validation: { minLength: 8 } }
```

---

## چند خطی و محتوای غنی

### `textarea` — چند خطی

```ts
{ name: 'bio', type: 'textarea', label: 'درباره من', colSpan: 12 }
```

---

## تاریخ و زمان

### `date` — تاریخ

```ts
{ name: 'dob', type: 'date', label: 'تاریخ تولد' }
```

### `time` — زمان

```ts
{ name: 'meetingTime', type: 'time', label: 'زمان جلسه' }
```

### `datetime` — تاریخ + زمان

```ts
{ name: 'scheduledAt', type: 'datetime', label: 'زمان برنامه‌ریزی‌شده' }
```

---

## انتخاب

### `select` — انتخاب تکی

```ts
{
  name: 'city',
  type: 'select',
  label: 'شهر',
  options: [
    { label: 'تهران',  value: 'tehran' },
    { label: 'مشهد',   value: 'mashhad' },
    { label: 'اصفهان', value: 'isfahan' },
  ]
}
```

### `multiselect` — انتخاب چندگانه

```ts
{
  name: 'skills',
  type: 'multiselect',
  label: 'مهارت‌ها',
  options: [
    { label: 'React',      value: 'react' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Node.js',    value: 'node' },
  ]
}
```

### `radio` — دکمه رادیویی

```ts
{
  name: 'gender',
  type: 'radio',
  label: 'جنسیت',
  options: [
    { label: 'مرد',  value: 'm' },
    { label: 'زن',   value: 'f' },
    { label: 'سایر', value: 'o' },
  ]
}
```

---

## Toggle

### `checkbox` — چک‌باکس

```ts
{ name: 'agree', type: 'checkbox', label: 'قوانین را می‌پذیرم' }
```

### `switch` — سوییچ

```ts
{ name: 'notifications', type: 'switch', label: 'اعلان‌ها را فعال کن' }
```

---

## ورودی‌های ویژه

### `otp` — کد تایید

```ts
{ name: 'code', type: 'otp', label: 'کد تایید', mask: 'otp' }
```

### `file` — آپلود فایل

```ts
{ name: 'avatar', type: 'file', label: 'تصویر پروفایل' }
```

### `range` — محدوده / اسلایدر

```ts
{ name: 'volume', type: 'range', label: 'صدا', validation: { min: 0, max: 100 }, defaultValue: 50 }
```

### `color` — انتخاب رنگ

```ts
{ name: 'brandColor', type: 'color', label: 'رنگ برند', defaultValue: '#10b981' }
```

### `rating` — امتیاز

```ts
{ name: 'stars', type: 'rating', label: 'تجربه‌ات را امتیاز بده' }
```

---

## ترکیبی

### `repeater` — تکرارشونده

```ts
{
  name: 'contacts',
  type: 'repeater',
  label: 'مخاطبات اضطراری',
  colSpan: 12,
  repeaterConfig: {
    minRows: 1,
    maxRows: 5,
    addLabel: 'افزودن مخاطب',
    fields: [
      { name: 'name',  type: 'text', label: 'نام',    colSpan: 6 },
      { name: 'phone', type: 'tel',  label: 'موبایل', colSpan: 6, mask: 'phone' },
    ]
  }
}
```

---

## فیلد سفارشی

### `custom` — فیلد دلخواه

```ts
{
  name: 'location',
  type: 'custom',
  label: 'موقعیت مکانی',
  colSpan: 12,
  render: ({ value, onChange, error }) => (
    <MapPicker value={value} onChange={onChange} error={error} />
  ),
}
```

---

## فیلدهای شرطی

هر فیلد می‌تواند بر اساس مقادیر جاری فرم نمایش داده یا مخفی شود:

```ts
{
  name: 'companyName',
  type: 'text',
  label: 'نام شرکت',
  hidden: (values) => values.accountType !== 'business',
  dependsOn: ['accountType'],
}
```
