# فرمت‌کننده‌های مقدار

فرمت‌کننده‌ها مقدار ورودی را **پیش از ذخیره** در حالت فرم تبدیل می‌کنند.

## فرمت‌کننده‌های آماده

| کلید        | توضیح                     | مثال                              |
| ----------- | ------------------------- | --------------------------------- |
| `uppercase` | تبدیل به حروف بزرگ        | `hello` → `HELLO`                 |
| `lowercase` | تبدیل به حروف کوچک        | `HELLO` → `hello`                 |
| `trim`      | حذف فاصله‌های ابتدا/انتها | `" hi "` → `"hi"`                 |
| `number`    | تبدیل رشته به عدد         | `"42"` → `42`                     |
| `currency`  | فرمت ارزی                 | `1000000` → `"۱,۰۰۰,۰۰۰"`         |
| `slug`      | تبدیل به URL-slug         | `"Hello World"` → `"hello-world"` |

## استفاده

```ts
{ name: 'username',    type: 'text', label: 'نام کاربری', formatter: 'lowercase' }
{ name: 'productCode', type: 'text', label: 'کد محصول',   formatter: 'uppercase' }
{ name: 'price',       type: 'text', label: 'قیمت',        formatter: 'number' }
```

## فرمت‌کننده سفارشی (تابع)

```ts
{
  name: 'tags',
  type: 'text',
  label: 'تگ‌ها (با کاما جدا کنید)',
  formatter: (v: string) => v.split(',').map(t => t.trim()).filter(Boolean),
  // parser برای نمایش دوباره:
  parser: (v: string[]) => v.join(', '),
}
```

## ثبت فرمت‌کننده سفارشی

```ts
import { registerFormatter } from '@/form-engine/utils/formatter'

registerFormatter('persianNumber', (v: string) =>
  v.replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])
)

// در فیلد:
{ name: 'persianAge', type: 'text', label: 'سن', formatter: 'persianNumber' }
```
