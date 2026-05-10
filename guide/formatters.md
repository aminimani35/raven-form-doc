# Formatters & Parsers

Raven Form provides a two-way data transformation pipeline:

- **Formatter** — transforms the value _after_ masking, before it is stored in form state.
- **Parser** — transforms the stored value _back_ to a display value when rendering the field.

This lets you store clean, typed data (e.g. a `number`) while showing the user a nicely formatted string (e.g. `"۱٬۲۳۴٬۵۶۷"`).

---

## Using a formatter

```ts
{
  name: 'username',
  type: 'text',
  label: 'Username',
  formatter: 'trim',      // strip leading/trailing whitespace on every change
}
```

```ts
{
  name: 'code',
  type: 'text',
  label: 'Product Code',
  formatter: 'upper',     // store as UPPERCASE
}
```

```ts
{
  name: 'price',
  type: 'text',
  label: 'Price',
  mask: 'currency',
  formatter: 'currency',  // display formatted; stored value is also the formatted string
  parser: 'currency',     // parse to raw number when reading back
}
```

---

## Using a parser

```ts
{
  name: 'amount',
  type: 'text',
  label: 'Amount',
  mask: 'currency',
  parser: (stored) => Number(String(stored).replace(/[^\d]/g, '')),
  // Stored: 1234567 (number)
  // Displayed: '۱٬۲۳۴٬۵۶۷'
}
```

---

## Built-in formatters

| Key         | Function          | Description                                             |
| ----------- | ----------------- | ------------------------------------------------------- |
| `currency`  | `formatCurrency`  | Number → Persian locale string with thousand separators |
| `titleCase` | `formatTitleCase` | each word capitalised                                   |
| `trim`      | `formatTrim`      | strips leading/trailing whitespace                      |
| `upper`     | `formatUpperCase` | UPPERCASE                                               |
| `lower`     | `formatLowerCase` | lowercase                                               |

---

## Built-in parsers

| Key        | Function           | Description                               |
| ---------- | ------------------ | ----------------------------------------- |
| `currency` | `parseCurrency`    | Persian/formatted string → plain `number` |
| `number`   | `(v) => Number(v)` | any value → `number`                      |
| `string`   | `(v) => String(v)` | any value → `string`                      |

---

## Extending the registries

Both the formatter and parser registries are mutable. Add your own named transforms:

```ts
import { formatterRegistry, parserRegistry } from "raven-form/utils/formatter";

// Custom formatter: Iranian national code with dashes
formatterRegistry["nationalCode"] = (v) => {
  const s = String(v).replace(/\D/g, "").slice(0, 10);
  return s;
};

// Custom parser
parserRegistry["bool"] = (v) => v === "true" || v === true;
```

Now use the key anywhere:

```ts
{ name: 'nid', type: 'text', formatter: 'nationalCode' }
```

---

## The processing pipeline

On every `onChange`, Raven Form applies transformations in this order:

```
Raw input value
    │
    ▼  (1) mask     — formats the string for display
    │
    ▼  (2) formatter — transforms the formatted value before storage
    │
    ▼  stored in form state
    │
    ▼  (3) parser    — converts stored value back to display value (on render)
    │
    ▼  displayed to user
```

---

## `applyFormatter` and `applyParser` utilities

```ts
import { applyFormatter, applyParser } from "raven-form/utils/formatter";

applyFormatter("  hello world  ", "trim"); // → 'hello world'
applyFormatter("hello", "upper"); // → 'HELLO'
applyFormatter(1234567, "currency"); // → '۱٬۲۳۴٬۵۶۷'

applyParser("۱٬۲۳۴٬۵۶۷", "currency"); // → 1234567
applyParser("42", "number"); // → 42
```
