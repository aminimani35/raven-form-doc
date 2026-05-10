# فیلد تکرارشونده (Repeater)

`RavenRepeater` اجازه می‌دهد کاربر ردیف‌هایی از داده ساختاریافته را اضافه و حذف کند.

## پیکربندی

```ts
interface RepeaterConfig {
  fields: FormField[];
  minRows?: number;
  maxRows?: number;
  addLabel?: string;
}
```

## مثال: مخاطبات اضطراری

```tsx
const schema = {
  id: "employee",
  fields: [
    { name: "name", type: "text", label: "نام کارمند", colSpan: 12 },
    {
      name: "emergencyContacts",
      type: "repeater",
      label: "مخاطبات اضطراری",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        maxRows: 5,
        addLabel: "+ افزودن مخاطب",
        fields: [
          { name: "name", type: "text", label: "نام", colSpan: 4 },
          {
            name: "relation",
            type: "select",
            label: "نسبت",
            colSpan: 4,
            options: [
              { label: "پدر/مادر", value: "parent" },
              { label: "همسر", value: "spouse" },
              { label: "دوست", value: "friend" },
            ],
          },
          {
            name: "phone",
            type: "tel",
            label: "موبایل",
            colSpan: 4,
            mask: "phone",
          },
        ],
      },
    },
  ],
};
```

## خروجی داده

```json
{
  "name": "علی رضایی",
  "emergencyContacts": [
    { "name": "مریم رضایی", "relation": "parent", "phone": "09121234567" },
    { "name": "سارا احمدی", "relation": "friend", "phone": "09351234567" }
  ]
}
```

## Props اضافه برای RavenRepeater

| نام        | نوع                        | توضیح               |
| ---------- | -------------------------- | ------------------- |
| `config`   | `RepeaterConfig`           | پیکربندی تکرارشونده |
| `value`    | `Record<string,unknown>[]` | مقدار فعلی          |
| `onChange` | `(rows) => void`           | تابع تغییر          |
| `adapter`  | `FormAdapter`              | آداپتور فرم         |
