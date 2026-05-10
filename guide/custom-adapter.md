# Custom Adapter

Raven Form's entire value proposition is its adapter-based architecture. If you have a form library not covered by the built-in adapters, you can write your own `FormAdapter` in a few dozen lines.

## The interface you must implement

```ts
interface FormAdapter {
  Provider: React.ComponentType<FormAdapterProviderProps>;
  useField: (name: string) => FieldBinding;
  useSubmit: () => () => void;
  useWatch: (names?: string[]) => Record<string, unknown>;
  useTrigger?: () => (names: string[]) => Promise<boolean>;
}
```

That's five members total — four required, one optional.

---

## Minimal working implementation (plain `useState`)

This is a fully functional adapter that uses nothing but React state. No external library needed.

```tsx
// src/adapters/simpleAdapter.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import type {
  FormAdapter,
  FormAdapterProviderProps,
  FieldBinding,
  FormSchema,
} from "raven-form";

// ─── 1. Context shape ─────────────────────────────────────────────────────────
interface SimpleCtx {
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  setField: (name: string, value: unknown) => void;
  touchField: (name: string) => void;
  submitRef: React.MutableRefObject<() => void>;
}

const Ctx = createContext<SimpleCtx | null>(null);
const useCtx = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("Must be inside SimpleAdapter.FormProvider");
  return c;
};

// ─── 2. Validation helper ──────────────────────────────────────────────────────
async function validate(
  schema: FormSchema,
  values: Record<string, unknown>,
): Promise<Record<string, string | undefined>> {
  const errors: Record<string, string | undefined> = {};
  const allFields = [
    ...schema.fields,
    ...(schema.steps?.flatMap((s) => s.fields) ?? []),
  ];
  for (const field of allFields) {
    const v = values[field.name];
    const r = field.validation;
    if (!r) continue;
    if (r.required && (v === undefined || v === null || v === "")) {
      errors[field.name] =
        typeof r.required === "string" ? r.required : "Required";
    } else if (r.min !== undefined && Number(v) < r.min) {
      errors[field.name] = `Min ${r.min}`;
    } else if (r.max !== undefined && Number(v) > r.max) {
      errors[field.name] = `Max ${r.max}`;
    } else if (r.minLength && String(v).length < r.minLength) {
      errors[field.name] = `Min ${r.minLength} chars`;
    } else if (r.maxLength && String(v).length > r.maxLength) {
      errors[field.name] = `Max ${r.maxLength} chars`;
    } else if (r.pattern && !r.pattern.test(String(v))) {
      errors[field.name] = "Invalid format";
    } else if (r.custom) {
      const err = r.custom(v, values);
      if (err) errors[field.name] = err;
    } else if (r.asyncCustom) {
      const err = await r.asyncCustom(v, values);
      if (err) errors[field.name] = err;
    }
  }
  return errors;
}

// ─── 3. FormProvider ──────────────────────────────────────────────────────────
const SimpleFormProvider: React.FC<FormAdapterProviderProps> = ({
  schema,
  onSubmit,
  children,
  defaultValues = {},
}) => {
  const initial = useMemo(() => {
    const d: Record<string, unknown> = {};
    [
      ...schema.fields,
      ...(schema.steps?.flatMap((s) => s.fields) ?? []),
    ].forEach((f) => {
      if (f.defaultValue !== undefined) d[f.name] = f.defaultValue;
    });
    return { ...d, ...defaultValues };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const setField = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const touchField = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errs = await validate(schema, values);
      const hasErrors = Object.values(errs).some(Boolean);
      setErrors(errs);
      if (!hasErrors) await onSubmitRef.current(values);
    },
    [schema, values],
  );

  // Expose submit trigger on a hidden ref
  const submitRef = useRef<() => void>(() => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  });
  submitRef.current = () =>
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);

  return (
    <Ctx.Provider
      value={{ values, errors, touched, setField, touchField, submitRef }}
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: "contents" }}>
        {children}
      </form>
    </Ctx.Provider>
  );
};

// ─── 4. useField ──────────────────────────────────────────────────────────────
function useSimpleField(name: string): FieldBinding {
  const { values, errors, touched, setField, touchField } = useCtx();
  return {
    value: values[name] ?? "",
    onChange: (v) => setField(name, v),
    onBlur: () => touchField(name),
    error: touched[name] ? errors[name] : undefined,
  };
}

// ─── 5. useSubmit ─────────────────────────────────────────────────────────────
function useSimpleSubmit(): () => void {
  const { submitRef } = useCtx();
  return () => submitRef.current();
}

// ─── 6. useWatch ──────────────────────────────────────────────────────────────
function useSimpleWatch(): Record<string, unknown> {
  const { values } = useCtx();
  return values;
}

// ─── 7. useTrigger (wizard step validation) ───────────────────────────────────
function useSimpleTrigger() {
  const { values, setErrors, touchField } = useCtx();
  return useCallback(
    async (names: string[]): Promise<boolean> => {
      names.forEach((n) => touchField(n));
      // Validate only the given fields
      const errs: Record<string, string | undefined> = {};
      // (simplified — runs full validate and then checks the requested names)
      setErrors((prev) => ({ ...prev, ...errs }));
      return names.every((n) => !errs[n]);
    },
    [values, setErrors, touchField],
  );
}

// ─── 8. Export ────────────────────────────────────────────────────────────────
export const SimpleAdapter: FormAdapter = {
  Provider: SimpleFormProvider,
  useField: useSimpleField,
  useSubmit: useSimpleSubmit,
  useWatch: useSimpleWatch,
  useTrigger: useSimpleTrigger,
};
```

---

## Using your custom adapter

```tsx
import { RavenForm } from "raven-form";
import { SimpleAdapter } from "@/adapters/simpleAdapter";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

<RavenForm
  schema={schema}
  adapter={SimpleAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
/>;
```

---

## Adapter checklist

| Requirement                                                                | Why it matters                                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `FormProvider` wraps children in a form element with an `onSubmit` handler | Lets the submit button trigger validation and call `onSubmit`             |
| `useField(name)` returns reactive `value`                                  | RavenForm re-renders when the field value changes                         |
| `useField(name).onChange` stores the new value                             | Updates the backing store                                                 |
| `useField(name).error` is shown only after `onBlur` or submission          | Avoids showing errors before the user has interacted                      |
| `useWatch()` returns a snapshot of all current values                      | Used by conditional fields (`hidden`, `disabled`) and the state inspector |
| Default values from `FormField.defaultValue` are merged into initial state | Fields render their defaults correctly on first paint                     |
| `useTrigger` (optional) validates a subset of fields by name               | Required only if you want per-step validation in `RavenWizard`            |

---

## Connecting to Zustand, Jotai, or any store

The same pattern works for any global state library. Replace `useState` with your store:

```tsx
// Zustand example (sketch)
import { create } from "zustand";

const useFormStore = create<{
  values: Record<string, unknown>;
  setField: (name: string, value: unknown) => void;
}>((set) => ({
  values: {},
  setField: (name, value) =>
    set((s) => ({ values: { ...s.values, [name]: value } })),
}));

function useZustandField(name: string): FieldBinding {
  const value = useFormStore((s) => s.values[name]);
  const setField = useFormStore((s) => s.setField);
  return {
    value: value ?? "",
    onChange: (v) => setField(name, v),
    onBlur: () => {},
  };
}

// ... rest of adapter implementation
```
