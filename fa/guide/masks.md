# ماسک ورودی

ماسک‌ها فرمت ورودی را برای کاربر مشخص می‌کنند (مثلاً شماره موبایل، کد ملی، شماره کارت).

## ماسک‌های آماده

| کلید         | نمونه خروجی                        |
| ------------ | ---------------------------------- |
| `phone`      | `0912 345 6789`                    |
| `nationalId` | `۰۱۲-۳۴۵۶۷۸-۹`                     |
| `postalCode` | `12345-67890`                      |
| `creditCard` | `1234 5678 9012 3456`              |
| `iban`       | `IR12 3456 7890 1234 5678 9012 34` |
| `otp`        | `۱۲۳۴۵۶`                           |

## استفاده

```ts
{ name: 'phone',      type: 'tel',  label: 'موبایل',     mask: 'phone' }
{ name: 'nationalId', type: 'text', label: 'کد ملی',     mask: 'nationalId' }
{ name: 'card',       type: 'text', label: 'شماره کارت', mask: 'creditCard' }
```

## ماسک سفارشی (تابع)

```ts
{
  name: 'taxId',
  type: 'text',
  label: 'شناسه مالیاتی',
  mask: (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 9) return `${digits.slice(0,3)}-${digits.slice(3)}`
    return `${digits.slice(0,3)}-${digits.slice(3,9)}-${digits.slice(9)}`
  }
}
```

## ثبت ماسک سفارشی

```ts
import { registerMask } from '@/form-engine/utils/mask'

registerMask('staffId', (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 6)
  return d.length > 2 ? `${d.slice(0,2)}-${d.slice(2)}` : d
})

// در فیلد:
{ name: 'staffId', type: 'text', label: 'کد پرسنلی', mask: 'staffId' }
```
