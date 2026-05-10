# Formik Adapter

Raven Form does not ship a Formik adapter by default, but the `FormAdapter` interface is simple enough to implement in about 80 lines. This guide walks you through the complete `FormikAdapter` implementation and shows you a working example.

## Installation

```bash
npm install formik
# or
pnpm add formik
```

---

## Building `FormikAdapter`

Create `src/adapters/formikAdapter.tsx` in your project:

```tsx
import React, { useContext, useMemo, useRef, useCallback } from "react";
import { Formik, useFormikContext, Field } from "formik";
import type {
  FormAdapter,
  FormAdapterProviderProps,
  FieldBinding,
  FormSchema,
} from "raven-form";

// ─── Build initial values from schema ──────────────────────────────────────────
function buildInitialValues(
  schema: FormSchema,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  schema.fields.forEach((f) => {
    if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
  });
  // Also process wizard steps if present
  schema.steps?.forEach((step) => {
    step.fields.forEach((f) => {
      if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
    });
  });
  return { ...defaults, ...overrides };
}

// ─── Build Yup-style validate function from FieldValidation ───────────────────
function buildValidate(schema: FormSchema) {
  return async (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};
    const allFields = [
      ...schema.fields,
      ...(schema.steps?.flatMap((s) => s.fields) ?? []),
    ];
    for (const field of allFields) {
      const v = values[field.name];
      const val = field.validation;
      if (!val) continue;

      if (val.required && (v === undefined || v === null || v === "")) {
        errors[field.name] =
          typeof val.required === "string"
            ? val.required
            : "This field is required";
        continue;
      }
      if (val.min !== undefined && typeof v === "number" && v < val.min) {
        errors[field.name] = `Minimum value is ${val.min}`;
        continue;
      }
      if (val.max !== undefined && typeof v === "number" && v > val.max) {
        errors[field.name] = `Maximum value is ${val.max}`;
        continue;
      }
      if (
        val.minLength !== undefined &&
        typeof v === "string" &&
        v.length < val.minLength
      ) {
        errors[field.name] = `Minimum ${val.minLength} characters required`;
        continue;
      }
      if (
        val.maxLength !== undefined &&
        typeof v === "string" &&
        v.length > val.maxLength
      ) {
        errors[field.name] = `Maximum ${val.maxLength} characters allowed`;
        continue;
      }
      if (val.pattern && typeof v === "string" && !val.pattern.test(v)) {
        errors[field.name] = "Invalid format";
        continue;
      }
      if (val.custom) {
        const err = val.custom(v, values);
        if (err) {
          errors[field.name] = err;
          continue;
        }
      }
      if (val.asyncCustom) {
        const err = await val.asyncCustom(v, values);
        if (err) {
          errors[field.name] = err;
          continue;
        }
      }
    }
    return errors;
  };
}

// ─── FormProvider ─────────────────────────────────────────────────────────────
const FormikFormProvider: React.FC<FormAdapterProviderProps> = ({
  schema,
  onSubmit,
  children,
  defaultValues,
}) => {
  const initialValues = useMemo(
    () => buildInitialValues(schema, defaultValues),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const validate = useMemo(() => buildValidate(schema), [schema]);

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      validateOnChange
      validateOnBlur
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values as Record<string, unknown>);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "contents" }}
        >
          {children}
        </form>
      )}
    </Formik>
  );
};

// ─── useField ─────────────────────────────────────────────────────────────────
function useFormikField(name: string): FieldBinding {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<Record<string, unknown>>();

  return {
    value: values[name] ?? "",
    onChange: (v: unknown) => setFieldValue(name, v),
    onBlur: () => setFieldTouched(name, true),
    error: touched[name] ? (errors[name] as string | undefined) : undefined,
  };
}

// ─── useSubmit ────────────────────────────────────────────────────────────────
function useFormikSubmit(): () => void {
  const { submitForm } = useFormikContext();
  return submitForm;
}

// ─── useWatch ────────────────────────────────────────────────────────────────
function useFormikWatch(): Record<string, unknown> {
  const { values } = useFormikContext<Record<string, unknown>>();
  return values;
}

// ─── useTrigger (step validation support) ────────────────────────────────────
function useFormikTrigger() {
  const { validateForm, setFieldTouched } =
    useFormikContext<Record<string, unknown>>();
  return useCallback(
    async (names: string[]): Promise<boolean> => {
      names.forEach((n) => setFieldTouched(n, true, false));
      const errors = await validateForm();
      return names.every((n) => !errors[n]);
    },
    [validateForm, setFieldTouched],
  );
}

// ─── Exported adapter ─────────────────────────────────────────────────────────
export const FormikAdapter: FormAdapter = {
  FormProvider: FormikFormProvider,
  useField: useFormikField,
  useSubmit: useFormikSubmit,
  useWatch: useFormikWatch,
  useTrigger: useFormikTrigger,
};
```

---

## Using `FormikAdapter`

Once you have the adapter, drop it in anywhere you use `RavenForm`:

```tsx
import { RavenForm } from "raven-form";
import { FormikAdapter } from "@/adapters/formikAdapter";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

export function MyForm() {
  return (
    <RavenForm
      schema={schema}
      adapter={FormikAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={(values) => console.log(values)}
      submitLabel="Save"
    />
  );
}
```

---

## Working example — product form

```tsx
import { RavenForm } from "raven-form";
import { FormikAdapter } from "@/adapters/formikAdapter";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";
import type { FormSchema } from "raven-form";

const productSchema: FormSchema = {
  fields: [
    {
      name: "title",
      type: "text",
      label: "Product Title",
      colSpan: 8,
      validation: { required: true, minLength: 3, maxLength: 100 },
    },
    {
      name: "sku",
      type: "text",
      label: "SKU",
      colSpan: 4,
      formatter: "upper",
      validation: {
        required: true,
        pattern: /^[A-Z0-9\-]{3,20}$/,
      },
    },
    {
      name: "price",
      type: "number",
      label: "Price (USD)",
      colSpan: 4,
      validation: { required: true, min: 0 },
    },
    {
      name: "comparePrice",
      type: "number",
      label: "Compare-at Price",
      colSpan: 4,
      description: "Original price before discount",
      validation: {
        custom: (v, fv) =>
          v && Number(v) <= Number(fv.price)
            ? "Compare-at price must be greater than the selling price"
            : null,
      },
      dependsOn: ["price"],
    },
    {
      name: "stock",
      type: "number",
      label: "Stock Quantity",
      colSpan: 4,
      validation: { required: true, min: 0 },
      defaultValue: 0,
    },
    {
      name: "category",
      type: "select",
      label: "Category",
      colSpan: 6,
      validation: { required: true },
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Books", value: "books" },
        { label: "Home & Garden", value: "home" },
      ],
    },
    {
      name: "tags",
      type: "multiselect",
      label: "Tags",
      colSpan: 6,
      options: [
        { label: "New Arrival", value: "new" },
        { label: "Bestseller", value: "best" },
        { label: "On Sale", value: "sale" },
        { label: "Featured", value: "featured" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      colSpan: 12,
      validation: { required: true, minLength: 20 },
    },
    {
      name: "published",
      type: "switch",
      label: "Published",
      defaultValue: false,
    },
    {
      name: "featured",
      type: "switch",
      label: "Featured on homepage",
      defaultValue: false,
      hidden: (values) => !values.published,
      dependsOn: ["published"],
    },
  ],
};

export function ProductForm({
  product,
}: {
  product?: Record<string, unknown>;
}) {
  const handleSubmit = async (values: Record<string, unknown>) => {
    await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  };

  return (
    <RavenForm
      schema={productSchema}
      adapter={FormikAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={handleSubmit}
      defaultValues={product}
      submitLabel={product ? "Save Changes" : "Create Product"}
      showStateInspector
    />
  );
}
```

---

## Wizard with Formik

`FormikAdapter` implements `useTrigger`, so it works with `RavenWizard` out of the box:

```tsx
import { RavenWizardForm } from "raven-form";
import { FormikAdapter } from "@/adapters/formikAdapter";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

<RavenWizardForm
  schema={wizardSchema}
  adapter={FormikAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
/>;
```

---

## Differences from `RHFAdapter`

| Feature                               | RHFAdapter                           | FormikAdapter                           |
| ------------------------------------- | ------------------------------------ | --------------------------------------- |
| Backing library                       | `react-hook-form`                    | `formik`                                |
| Validation mode                       | `onChange` (per-field, uncontrolled) | `onChange` + `onBlur` (controlled)      |
| `useTrigger` (wizard step validation) | ✅                                   | ✅                                      |
| Async validation                      | ✅ (debounced)                       | ✅ (on validate call)                   |
| Performance                           | Uncontrolled — fewer re-renders      | Controlled — re-renders on every change |
| Bundle size                           | Smaller                              | Slightly larger                         |
