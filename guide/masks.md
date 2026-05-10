# Input Masking

Raven Form includes a built-in masking system. A mask is applied on every `onChange` event **before** the value is stored, ensuring the user always sees a consistently formatted string.

## Applying a mask

Set the `mask` property on any `FormField` to a named mask key or a custom function:

```ts
// Named mask
{ name: 'phone',   type: 'tel',  label: 'Phone',   mask: 'phone' }
{ name: 'card',    type: 'text', label: 'Card No.', mask: 'bankCard' }

// Inline function
{ name: 'custom',  type: 'text', label: 'Custom',  mask: (v) => v.toUpperCase().slice(0, 5) }
```

---

## Built-in masks

### `phone` — Iranian mobile number

Formats as `0912 345 6789` (space-separated groups of 4, 3, and 4 digits, max 11 digits).

```ts
maskPhone("09123456789"); // → '0912 345 6789'
```

### `bankCard` — Bank card number

Formats as `1234 5678 9012 3456` (space every 4 digits, max 16 digits).

```ts
maskBankCard("1234567890123456"); // → '1234 5678 9012 3456'
```

### `currency` — Currency with thousand separators

Strips non-digits and formats with Persian locale (`fa-IR`) thousand separators.

```ts
maskCurrency("1234567"); // → '۱٬۲۳۴٬۵۶۷'
```

### `nationalCode` — Iranian national code

Strips non-digits, max 10 characters.

```ts
maskNationalCode("1234567890"); // → '1234567890'
```

### `postalCode` — Postal code

Formats as `12345-67890` (5 digits, dash, 5 digits).

```ts
maskPostalCode("1234567890"); // → '12345-67890'
```

### `otp` — OTP / verification code

Digits only, max 6 characters.

```ts
maskOTP("123456"); // → '123456'
```

### `iban` — IBAN (Iranian bank)

Starts with `IR`, followed by 24 digits, formatted in groups of 4.

```ts
maskIBAN("IR123456789012345678901234"); // → 'IR12 3456 7890 1234 5678 9012 34'
```

---

## The mask registry

All named masks are stored in a global registry:

```ts
import { maskRegistry } from "raven-form/utils/mask";

console.log(Object.keys(maskRegistry));
// ['phone', 'bankCard', 'currency', 'nationalCode', 'postalCode', 'iban', 'otp']
```

You can extend the registry at runtime to add your own named masks:

```ts
import { maskRegistry } from 'raven-form/utils/mask'

maskRegistry['licensePlate'] = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
}

// Now use it in any field:
{ name: 'plate', type: 'text', label: 'License Plate', mask: 'licensePlate' }
```

---

## How masking interacts with validation

Masking runs **before** storage. The masked string is what gets validated and ultimately submitted. If you need the raw numeric value in `onSubmit`, use a `parser` in combination with your mask:

```ts
{
  name: 'price',
  type: 'text',
  label: 'Price',
  mask: 'currency',
  parser: (v) => Number(String(v).replace(/[^\d]/g, '')),
  // Stored in form: '۱٬۲۳۴٬۵۶۷'
  // After parser:   1234567  (number)
}
```

---

## `applyMask` utility

You can use the masking utility directly in your own code:

```ts
import { applyMask } from "raven-form/utils/mask";

applyMask("09123456789", "phone"); // → '0912 345 6789'
applyMask("hello", (v) => v.toUpperCase()); // → 'HELLO'
```
