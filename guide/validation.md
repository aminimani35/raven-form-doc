# Validation

Raven Form provides a unified `FieldValidation` interface that works across any form adapter. Both synchronous and asynchronous validators are supported.

## `FieldValidation` interface

```ts
interface FieldValidation<T = unknown> {
  required?: boolean | string; // required with optional custom message
  min?: number; // minimum numeric value
  max?: number; // maximum numeric value
  minLength?: number; // minimum string length
  maxLength?: number; // maximum string length
  pattern?: RegExp; // regex pattern
  custom?: (value: T, formValues: Record<string, unknown>) => string | null;
  asyncCustom?: (
    value: T,
    formValues: Record<string, unknown>,
  ) => Promise<string | null>;
}
```

---

## Required fields

```ts
// Boolean required — adapter provides a default message
{ name: 'email', type: 'email', validation: { required: true } }

// String required — your custom message
{ name: 'email', type: 'email', validation: { required: 'Email address is required' } }
```

---

## Length constraints

```ts
{
  name: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    minLength: 3,
    maxLength: 20,
  }
}
```

---

## Numeric range

```ts
{
  name: 'age',
  type: 'number',
  label: 'Age',
  validation: { min: 18, max: 120 }
}
```

---

## Pattern (regex)

```ts
{
  name: 'nationalCode',
  type: 'text',
  label: 'National Code',
  validation: {
    pattern: /^\d{10}$/,
  }
}
```

---

## Synchronous custom validator

The `custom` function receives the current field `value` and the entire `formValues` snapshot. Return a string error message or `null`.

```ts
{
  name: 'confirmPassword',
  type: 'password',
  label: 'Confirm Password',
  validation: {
    required: true,
    custom: (value, formValues) => {
      if (value !== formValues.password) {
        return 'Passwords do not match'
      }
      return null
    },
  },
  dependsOn: ['password'],
}
```

---

## Asynchronous custom validator

The `asyncCustom` function returns a `Promise<string | null>`. Raven Form debounces async validation by 400 ms by default and shows a spinner indicator while validating.

```ts
{
  name: 'username',
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    asyncCustom: async (value) => {
      const taken = await checkUsernameAvailability(value as string)
      return taken ? 'Username is already taken' : null
    },
  }
}
```

> You can customise the debounce delay via the `debounceMs` property inside `useRavenField` if you need to adjust the async timing.

---

## Combining validators

All validation properties can be combined. They are evaluated in this order:

1. `required`
2. `min` / `max`
3. `minLength` / `maxLength`
4. `pattern`
5. `custom`
6. `asyncCustom`

```ts
{
  name: 'email',
  type: 'email',
  label: 'Work Email',
  validation: {
    required: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    asyncCustom: async (value) => {
      const blocked = await isBlockedDomain(value as string)
      return blocked ? 'Personal email addresses are not allowed' : null
    },
  }
}
```

---

## Error messages

Error messages flow from the adapter back to the UI adapter's `FormItem` component. By default:

| Rule             | Default message                                 |
| ---------------- | ----------------------------------------------- |
| `required: true` | `"این فیلد الزامی است"` (adapter-level default) |
| `min`            | `"حداقل مقدار N است"`                           |
| `max`            | `"حداکثر مقدار N است"`                          |
| `minLength`      | `"حداقل N کاراکتر وارد کنید"`                   |
| `maxLength`      | `"حداکثر N کاراکتر مجاز است"`                   |
| `pattern`        | `"فرمت وارد شده صحیح نیست"`                     |

Override any message by providing a string instead of a boolean, or by returning your own string from `custom`.

---

## Validation mode

The RHF adapter runs in `mode: "onChange"` by default — validation fires as the user types. The adapter's `useTrigger` hook is also exposed for the wizard to validate a specific step's fields before advancing.
