# Field Types

Raven Form supports **25+ field types** out of the box. Every field is described by a `FormField` object within your schema's `fields` array.

## FormField common properties

| Property         | Type                             | Description                                          |
| ---------------- | -------------------------------- | ---------------------------------------------------- |
| `name`           | `string`                         | Unique field identifier (used as the form value key) |
| `type`           | `FieldType`                      | The field type (see list below)                      |
| `label`          | `string`                         | Human-readable label                                 |
| `placeholder`    | `string`                         | Placeholder text                                     |
| `description`    | `string`                         | Helper text shown below the field                    |
| `defaultValue`   | `T`                              | Initial value                                        |
| `colSpan`        | `1–12`                           | How many columns this field occupies (default: 6)    |
| `disabled`       | `boolean \| (values) => boolean` | Static or dynamic disabled state                     |
| `hidden`         | `boolean \| (values) => boolean` | Static or dynamic visibility                         |
| `validation`     | `FieldValidation`                | Validation rules                                     |
| `mask`           | `string \| (v) => string`        | Input masking function or registry key               |
| `formatter`      | `string \| (v) => unknown`       | Transform value on change                            |
| `parser`         | `string \| (v) => T`             | Transform stored value to display value              |
| `options`        | `Option[]`                       | Options for select/radio/multiselect fields          |
| `dependsOn`      | `string[]`                       | Watch these field names to trigger re-evaluation     |
| `render`         | `(ctx) => ReactNode`             | Custom render function (`type: "custom"`)            |
| `componentProps` | `Record<string, unknown>`        | Extra props forwarded to the underlying UI component |
| `repeaterConfig` | `RepeaterConfig`                 | Config for `type: "repeater"` fields                 |

---

## Text inputs

### `text`

Standard single-line text input.

```ts
{ name: 'username', type: 'text', label: 'Username', colSpan: 6 }
```

### `email`

Text input with `type="email"` and built-in browser email validation.

```ts
{ name: 'email', type: 'email', label: 'Email', validation: { required: true } }
```

### `tel`

Phone number input. Pair with the `phone` mask for automatic formatting.

```ts
{ name: 'phone', type: 'tel', label: 'Phone', mask: 'phone' }
```

### `url`

URL input with `type="url"`.

```ts
{ name: 'website', type: 'url', label: 'Website' }
```

### `number`

Numeric input. Use `validation.min` / `validation.max` to constrain the range.

```ts
{ name: 'age', type: 'number', label: 'Age', validation: { min: 18, max: 120 } }
```

### `password`

Password input with masked characters.

```ts
{ name: 'password', type: 'password', label: 'Password', validation: { minLength: 8 } }
```

---

## Multi-line & rich

### `textarea`

Multi-line text input.

```ts
{ name: 'bio', type: 'textarea', label: 'Bio', colSpan: 12 }
```

---

## Date & time

### `date`

Date picker. Delegates to the UI adapter's `DatePicker` component.

```ts
{ name: 'dob', type: 'date', label: 'Date of Birth' }
```

### `time`

Time input (`type="time"`).

```ts
{ name: 'meetingTime', type: 'time', label: 'Meeting Time' }
```

### `datetime`

Date + time input (`type="datetime-local"`).

```ts
{ name: 'scheduledAt', type: 'datetime', label: 'Scheduled At' }
```

---

## Selection

### `select`

Single-selection dropdown.

```ts
{
  name: 'country',
  type: 'select',
  label: 'Country',
  options: [
    { label: 'Iran', value: 'ir' },
    { label: 'USA',  value: 'us' },
  ]
}
```

### `multiselect`

Multiple-selection dropdown.

```ts
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  options: [
    { label: 'React', value: 'react' },
    { label: 'Vue',   value: 'vue' },
    { label: 'Svelte',value: 'svelte' },
  ]
}
```

### `radio`

Radio button group — one option selected at a time.

```ts
{
  name: 'gender',
  type: 'radio',
  label: 'Gender',
  options: [
    { label: 'Male',   value: 'm' },
    { label: 'Female', value: 'f' },
    { label: 'Other',  value: 'o' },
  ]
}
```

---

## Toggles

### `checkbox`

Single checkbox. The stored value is `true` / `false`.

```ts
{ name: 'agree', type: 'checkbox', label: 'I agree to the terms' }
```

### `switch`

Toggle switch. Semantically similar to checkbox.

```ts
{ name: 'notifications', type: 'switch', label: 'Enable notifications' }
```

> **Note:** `checkbox` and `switch` skip the `FormItem` wrapper and render inline.

---

## Special inputs

### `otp`

OTP / PIN input (digits only, max 6 characters by default). Delegates to `ui.OTPInput`.

```ts
{ name: 'code', type: 'otp', label: 'Verification Code', mask: 'otp' }
```

### `file`

File upload input. Delegates to `ui.FileInput`.

```ts
{ name: 'avatar', type: 'file', label: 'Profile Picture' }
```

### `range`

Slider / range input.

```ts
{
  name: 'brightness',
  type: 'range',
  label: 'Brightness',
  validation: { min: 0, max: 100 },
  defaultValue: 50,
}
```

### `color`

Color picker.

```ts
{ name: 'brandColor', type: 'color', label: 'Brand Color', defaultValue: '#10b981' }
```

### `rating`

Star (or similar) rating widget.

```ts
{ name: 'stars', type: 'rating', label: 'Rate your experience' }
```

---

## Compound

### `repeater`

Renders a dynamic list of sub-form rows. See the [Repeater Fields](/guide/repeater) guide for full details.

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
    fields: [
      { name: 'name',  type: 'text', label: 'Name',  colSpan: 6 },
      { name: 'phone', type: 'tel',  label: 'Phone', colSpan: 6, mask: 'phone' },
    ]
  }
}
```

---

## Escape hatch

### `custom`

Full control over rendering. The `render` callback receives a `FieldRenderContext`.

```ts
{
  name: 'avatar',
  type: 'custom',
  label: 'Profile Picture',
  render: ({ value, onChange, error }) => (
    <AvatarUploader
      value={value as string}
      onChange={onChange}
      error={error}
    />
  )
}
```

---

## Conditional fields

Any field can be shown/hidden or enabled/disabled based on live form values:

```ts
{
  name: 'otherReason',
  type: 'textarea',
  label: 'Please specify',
  hidden: (values) => values.reason !== 'other',
  dependsOn: ['reason'],
}
```

The `dependsOn` array is optional but recommended — it hints to the form engine which field changes should trigger a re-evaluation of the predicate.
