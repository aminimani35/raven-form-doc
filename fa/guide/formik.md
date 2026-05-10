# آداپتور Formik

اگر پروژه شما از [Formik](https://formik.org) استفاده می‌کند، می‌توانید یک آداپتور سفارشی بسازید.

## نصب

```bash
npm install formik
```

## پیاده‌سازی FormikAdapter

```ts
// adapters/formikAdapter.tsx
import React from 'react'
import { Formik, useFormikContext, useField as useFormikFieldHook } from 'formik'
import type { FormAdapter, FormSchema, FieldBinding } from '@/form-engine/types'

// ساخت مقادیر اولیه از اسکیما
function buildInitialValues(schema: FormSchema): Record<string, unknown> {
  return Object.fromEntries(
    schema.fields.map(f => [f.name, f.defaultValue ?? ''])
  )
}

// ساخت تابع validate از اسکیما
function buildValidate(schema: FormSchema) {
  return async (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {}
    for (const field of schema.fields) {
      const v = field.validation
      if (!v) continue
      const val = values[field.name]
      if (v.required && !val) {
        errors[field.name] = typeof v.required === 'string' ? v.required : 'اجباری است'
        continue
      }
      if (v.minLength) {
        const min = typeof v.minLength === 'number' ? v.minLength : v.minLength.value
        const msg = typeof v.minLength === 'object' ? v.minLength.message : `حداقل ${min} کاراکتر`
        if (typeof val === 'string' && val.length < min) { errors[field.name] = msg; continue }
      }
      if (v.pattern) {
        const re  = v.pattern instanceof RegExp ? v.pattern : v.pattern.value
        const msg = v.pattern instanceof RegExp ? 'فرمت نادرست' : v.pattern.message
        if (typeof val === 'string' && !re.test(val)) { errors[field.name] = msg; continue }
      }
      if (v.validate) {
        const res = await v.validate(val, values)
        if (res !== true) errors[field.name] = res as string
      }
    }
    return errors
  }
}

const FormikFormProvider: React.FC<{ schema: FormSchema; children: React.ReactNode }> = ({
  schema, children
}) => {
  const submitRef = React.useRef<((v: Record<string, unknown>) => void) | null>(null)
  return (
    <Formik
      initialValues={buildInitialValues(schema)}
      validate={buildValidate(schema)}
      onSubmit={(values) => submitRef.current?.(values)}
    >
      {children}
    </Formik>
  )
}

const useFormikField = (name: string): FieldBinding => {
  const [field, meta, helpers] = useFormikFieldHook(name)
  return {
    value:    field.value,
    onChange: helpers.setValue,
    onBlur:   field.onBlur,
    error:    meta.touched ? meta.error : undefined,
  }
}

const useFormikSubmit = (_schema: FormSchema, onSubmit: (v: Record<string, unknown>) => void) => {
  const ctx = useFormikContext<Record<string, unknown>>()
  React.useEffect(() => {
    (ctx as any).__submitHandler = onSubmit
  }, [onSubmit])
  return ctx.submitForm
}

const useFormikWatch = (name: string) => {
  const ctx = useFormikContext<Record<string, unknown>>()
  return ctx.values[name]
}

export const formikAdapter: FormAdapter = {
  FormProvider: FormikFormProvider,
  useField:     useFormikField,
  useSubmit:    useFormikSubmit,
  useWatch:     useFormikWatch,
}
```

---

## مثال: فرم محصول

```tsx
import { RavenForm } from "@/form-engine";
import { formikAdapter } from "@/adapters/formikAdapter";

const productSchema = {
  id: "product",
  columns: 12,
  fields: [
    {
      name: "name",
      type: "text",
      label: "نام محصول",
      colSpan: 8,
      validation: { required: true },
    },
    {
      name: "sku",
      type: "text",
      label: "کد محصول",
      colSpan: 4,
      validation: { required: true },
    },
    {
      name: "price",
      type: "number",
      label: "قیمت (تومان)",
      colSpan: 6,
      validation: { required: true, min: 0 },
    },
    {
      name: "stock",
      type: "number",
      label: "موجودی",
      colSpan: 6,
      validation: { min: 0 },
    },
    {
      name: "category",
      type: "select",
      label: "دسته‌بندی",
      colSpan: 6,
      options: [
        { label: "الکترونیک", value: "electronics" },
        { label: "پوشاک", value: "clothing" },
        { label: "کتاب", value: "books" },
      ],
    },
    { name: "description", type: "textarea", label: "توضیحات", colSpan: 12 },
    {
      name: "active",
      type: "switch",
      label: "فعال",
      colSpan: 6,
      defaultValue: true,
    },
  ],
};

export function ProductForm() {
  return (
    <RavenForm
      schema={productSchema}
      adapter={formikAdapter}
      onSubmit={(data) => console.log(data)}
      submitLabel="ذخیره محصول"
    />
  );
}
```

---

## مقایسه RHF و Formik

| ویژگی           | RHF                 | Formik |
| --------------- | ------------------- | ------ |
| رندر مجدد       | حداقل               | بیشتر  |
| حجم باندل       | کمتر                | بیشتر  |
| DevTools        | ✅                  | ✅     |
| یکپارچگی با Yup | با resolver         | داخلی  |
| Wizard          | ✅ (با RavenWizard) | ✅     |
