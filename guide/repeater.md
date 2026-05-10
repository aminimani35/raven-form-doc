# Repeater Fields

The `repeater` field type lets users dynamically add and remove rows of sub-fields at runtime. It is perfect for arrays of structured data such as addresses, emergency contacts, work experience, or line items.

## Basic example

```ts
{
  name: 'contacts',
  type: 'repeater',
  label: 'Emergency Contacts',
  colSpan: 12,
  repeaterConfig: {
    minRows: 1,
    maxRows: 5,
    addLabel: 'Add Contact',
    removeLabel: 'Remove',
    defaultRow: { name: '', phone: '', relationship: '' },
    fields: [
      { name: 'name',         type: 'text',   label: 'Full Name',      colSpan: 4 },
      { name: 'phone',        type: 'tel',    label: 'Phone Number',   colSpan: 4, mask: 'phone' },
      { name: 'relationship', type: 'select', label: 'Relationship',   colSpan: 4,
        options: [
          { label: 'Family',  value: 'family' },
          { label: 'Friend',  value: 'friend' },
          { label: 'Colleague', value: 'colleague' },
        ]
      },
    ]
  }
}
```

---

## `RepeaterConfig` interface

```ts
interface RepeaterConfig {
  /** Sub-fields rendered in each row */
  fields: FormField[];

  /** Minimum number of rows (rows below this cannot be removed) */
  minRows?: number;

  /** Maximum number of rows (Add button is hidden when this is reached) */
  maxRows?: number;

  /** Label for the Add Row button */
  addLabel?: string;

  /** Label / tooltip for the Remove Row button */
  removeLabel?: string;

  /** Default field values injected when a new row is added */
  defaultRow?: Record<string, unknown>;
}
```

---

## Field naming convention

Repeater sub-field names are automatically scoped with the parent field name and the row index:

```
contacts[0].name
contacts[0].phone
contacts[1].name
contacts[1].phone
...
```

This naming convention is compatible with React Hook Form's nested field path resolution, so validation and error messages work out of the box.

---

## Submitted value shape

The submitted form values contain the repeater data as a flat key-value map using the scoped naming:

```json
{
  "contacts[0].name": "Jane Doe",
  "contacts[0].phone": "0912 345 6789",
  "contacts[0].relationship": "family",
  "contacts[1].name": "John Smith",
  "contacts[1].phone": "0911 222 3333",
  "contacts[1].relationship": "friend"
}
```

> **Coming soon:** a utility helper `expandRepeaterValues(values, 'contacts')` that converts the flat map to an array `[{ name, phone, relationship }, ...]`. Until then you can do this post-processing in your `onSubmit` handler.

---

## Row UI

Each row is rendered as a bordered card with:

- A row number badge (`#1`, `#2`, …) in the top-left corner
- A delete button (🗑) in the top-right corner (hidden when `minRows` is reached)
- A responsive 12-column sub-grid for the row's fields

---

## Validation in repeater rows

Validation rules on sub-fields work exactly as they do on top-level fields:

```ts
fields: [
  {
    name: "email",
    type: "email",
    label: "Contact Email",
    colSpan: 6,
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
];
```

---

## `RavenRepeater` props

`RavenRepeater` is also exported as a standalone component for advanced use cases:

```ts
interface RavenRepeaterProps {
  field: FormField; // field with type="repeater" and repeaterConfig
  adapter: FormAdapter;
  ui: UIAdapter;
}
```

```tsx
import { RavenRepeaterField } from "raven-form";

<RavenRepeaterField
  field={contactsField}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
/>;
```
