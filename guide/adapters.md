# Form Adapters

A **Form Adapter** is the bridge between Raven Form and your chosen form-state management library. It implements the `FormAdapter` interface, which provides hooks for reading field values, subscribing to changes, triggering validation, and submitting.

## `FormAdapter` interface

```ts
interface FormAdapter {
  /** Wraps the form with the adapter's context provider */
  Provider: React.ComponentType<FormAdapterProviderProps>;

  /** Returns binding (value, onChange, onBlur, error) for a single field */
  useField: (name: string) => FieldBinding;

  /** Returns a function that triggers full form submission */
  useSubmit: () => () => void;

  /** Returns a snapshot of current form values. Pass names to watch specific fields. */
  useWatch: (names?: string[]) => Record<string, unknown>;

  /** (Optional) Validate specific field names. Used by RavenWizard for step gating. */
  useTrigger?: () => (names: string[]) => Promise<boolean>;
}
```

---

## `FieldBinding` interface

Each call to `adapter.useField(name)` returns a `FieldBinding`:

```ts
interface FieldBinding {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  isDirty?: boolean;
  isTouched?: boolean;
}
```

---

## Built-in adapters

### `RHFAdapter` — React Hook Form

The recommended adapter. Powered by [React Hook Form](https://react-hook-form.com/).

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

<RavenForm
  schema={schema}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
/>;
```

**Features:**

- `mode: "onChange"` — real-time validation
- Full `useTrigger` support (step-by-step wizard validation)
- Nested field paths for repeater rows (`contacts[0].name`)
- Async validators with debounce

### `AntDAdapter` — Ant Design Form

Uses Ant Design's `Form` component as the backing store.

```tsx
import { RavenForm } from "raven-form";
import { AntDAdapter } from "raven-form/adapters/antd";
import { AntDUIAdapter } from "raven-form/ui/antd";

<RavenForm
  schema={schema}
  adapter={AntDAdapter}
  ui={AntDUIAdapter}
  onSubmit={handleSubmit}
/>;
```

---

## Building a custom adapter

You can implement any form library as an adapter. Here is a minimal example using plain `useState`:

```tsx
import React, { useState, useRef } from "react";
import type {
  FormAdapter,
  FormAdapterProviderProps,
  FieldBinding,
} from "raven-form";

// Context that holds the form state
const Ctx = React.createContext<{
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  setField: (name: string, value: unknown) => void;
  submit: () => void;
} | null>(null);

const Provider: React.FC<FormAdapterProviderProps> = ({
  schema,
  onSubmit,
  children,
  defaultValues = {},
}) => {
  const [values, setValues] = useState<Record<string, unknown>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const setField = (name: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const submit = () => onSubmit(values);

  return (
    <Ctx.Provider value={{ values, errors, setField, submit }}>
      {children}
    </Ctx.Provider>
  );
};

function useStatefulField(name: string): FieldBinding {
  const ctx = React.useContext(Ctx)!;
  return {
    value: ctx.values[name] ?? "",
    onChange: (v) => ctx.setField(name, v),
    onBlur: () => {},
    error: ctx.errors[name],
  };
}

export const SimpleAdapter: FormAdapter = {
  FormProvider: Provider,
  useField: useStatefulField,
  useSubmit: () => {
    const ctx = React.useContext(Ctx)!;
    return ctx.submit;
  },
  useWatch: () => {
    const ctx = React.useContext(Ctx)!;
    return ctx.values;
  },
};
```

---

## `FormAdapterProviderProps`

```ts
interface FormAdapterProviderProps {
  schema: FormSchema;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  children: ReactNode;
  defaultValues?: Record<string, unknown>;
}
```

The `FormProvider` receives the full schema so adapters can extract default values declared on each `FormField.defaultValue` and merge them with any runtime `defaultValues` override.

---

## Using `createFormAdapter`

`createFormAdapter` validates your adapter at creation time and returns it typed as `FormAdapter`:

```ts
import { createFormAdapter } from 'raven-form'

const myAdapter = createFormAdapter({
  Provider: MyFormProvider,
  useField: (name) => ({ value, onChange, onBlur, error }),
  useSubmit: () => () => myForm.handleSubmit(),
  useWatch: (names?) => ({ field1: value1, ... }),
  // optional:
  useTrigger: () => async (names) => await myForm.trigger(names),
})
```

This is the recommended way to build adapters — it surfaces missing members as runtime errors in development.
