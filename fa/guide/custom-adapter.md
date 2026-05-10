# آداپتور سفارشی

می‌توانید برای هر سیستم مدیریت حالت یا کتابخانه فرم، یک آداپتور سفارشی بسازید.

## رابط FormAdapter

```ts
interface FormAdapter {
  FormProvider: React.FC<{ schema: FormSchema; children: ReactNode }>;
  useField: (name: string, schema: FormSchema) => FieldBinding;
  useSubmit: (
    schema: FormSchema,
    onSubmit: (v: Record<string, unknown>) => void,
  ) => () => void;
  useWatch: (name: string) => unknown;
  useTrigger?: (name: string) => () => Promise<boolean>;
}

interface FieldBinding {
  value: unknown;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  error?: string;
}
```

---

## ساده‌ترین آداپتور (با useState)

```tsx
// adapters/simpleAdapter.tsx
import React, { createContext, useContext, useRef, useState } from "react";
import type {
  FormAdapter,
  FormSchema,
  FieldBinding,
} from "@/form-engine/types";

interface Ctx {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  setField: (name: string, val: unknown) => void;
  touchField: (name: string) => void;
  touched: Record<string, boolean>;
  submitFn: React.MutableRefObject<
    ((v: Record<string, unknown>) => void) | null
  >;
}

const Ctx = createContext<Ctx>(null!);

function SimpleProvider({
  schema,
  children,
}: {
  schema: FormSchema;
  children: React.ReactNode;
}) {
  const init = Object.fromEntries(
    schema.fields.map((f) => [f.name, f.defaultValue ?? ""]),
  );
  const [values, setValues] = useState<Record<string, unknown>>(init);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const submitFn = useRef<((v: Record<string, unknown>) => void) | null>(null);

  const setField = (name: string, val: unknown) =>
    setValues((prev) => ({ ...prev, [name]: val }));

  const touchField = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  return (
    <Ctx.Provider
      value={{ values, errors, setField, touchField, touched, submitFn }}
    >
      {children}
    </Ctx.Provider>
  );
}

const useSimpleField = (name: string): FieldBinding => {
  const { values, errors, setField, touchField, touched } = useContext(Ctx);
  return {
    value: values[name] ?? "",
    onChange: (v) => setField(name, v),
    onBlur: () => touchField(name),
    error: touched[name] ? errors[name] : undefined,
  };
};

const useSimpleSubmit = (
  _schema: FormSchema,
  onSubmit: (v: Record<string, unknown>) => void,
) => {
  const { values, submitFn } = useContext(Ctx);
  submitFn.current = onSubmit;
  return () => {
    onSubmit(values);
  };
};

const useSimpleWatch = (name: string) => useContext(Ctx).values[name];

export const simpleAdapter: FormAdapter = {
  FormProvider: SimpleProvider,
  useField: useSimpleField,
  useSubmit: useSimpleSubmit,
  useWatch: useSimpleWatch,
};
```

---

## استفاده

```tsx
import { RavenForm } from '@/form-engine'
import { simpleAdapter } from '@/adapters/simpleAdapter'

<RavenForm schema={schema} adapter={simpleAdapter} onSubmit={...} />
```

---

## آداپتور Zustand (طرح کلی)

```ts
import { create } from "zustand";

interface FormStore {
  values: Record<string, unknown>;
  setField: (name: string, val: unknown) => void;
}

const useFormStore = create<FormStore>((set) => ({
  values: {},
  setField: (name, val) =>
    set((s) => ({ values: { ...s.values, [name]: val } })),
}));

// سپس useFormStore را در useField/useWatch/useSubmit استفاده کنید
```
