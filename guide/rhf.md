# React Hook Form Adapter

The `RHFAdapter` is the recommended form-state adapter for Raven Form. It is powered by [React Hook Form](https://react-hook-form.com/) — the industry standard for high-performance, uncontrolled React forms.

## Installation

```bash
npm install react-hook-form
# or
pnpm add react-hook-form
```

## Basic usage

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const schema = {
  fields: [
    {
      name: "name",
      type: "text",
      label: "Full Name",
      colSpan: 6,
      validation: { required: true },
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      colSpan: 6,
      validation: { required: true },
    },
  ],
};

export function MyForm() {
  return (
    <RavenForm
      schema={schema}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={(values) => console.log(values)}
      submitLabel="Submit"
    />
  );
}
```

---

## Working example — user registration

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";
import type { FormSchema } from "raven-form";

const registrationSchema: FormSchema = {
  fields: [
    // ── Personal info
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      colSpan: 6,
      validation: { required: "First name is required", minLength: 2 },
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      colSpan: 6,
      validation: { required: "Last name is required" },
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      colSpan: 8,
      validation: {
        required: "Email is required",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        // async uniqueness check
        asyncCustom: async (value) => {
          const res = await fetch(`/api/check-email?email=${value}`);
          const { taken } = await res.json();
          return taken ? "This email address is already registered" : null;
        },
      },
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone Number",
      colSpan: 4,
      mask: "phone",
      placeholder: "0912 345 6789",
    },

    // ── Password
    {
      name: "password",
      type: "password",
      label: "Password",
      colSpan: 6,
      validation: {
        required: "Password is required",
        minLength: 8,
        custom: (v) =>
          /[A-Z]/.test(v as string)
            ? null
            : "Password must contain at least one uppercase letter",
      },
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      colSpan: 6,
      validation: {
        required: "Please confirm your password",
        custom: (value, formValues) =>
          value === formValues.password ? null : "Passwords do not match",
      },
      dependsOn: ["password"],
    },

    // ── Role / plan
    {
      name: "role",
      type: "radio",
      label: "Account Type",
      colSpan: 12,
      defaultValue: "personal",
      options: [
        { label: "👤 Personal", value: "personal" },
        { label: "🏢 Business", value: "business" },
        { label: "🎓 Educational", value: "education" },
      ],
    },
    {
      name: "companyName",
      type: "text",
      label: "Company Name",
      colSpan: 6,
      hidden: (values) => values.role !== "business",
      validation: {
        custom: (v, fv) =>
          fv.role === "business" && !v ? "Company name is required" : null,
      },
      dependsOn: ["role"],
    },
    {
      name: "vatNumber",
      type: "text",
      label: "VAT Number",
      colSpan: 6,
      hidden: (values) => values.role !== "business",
      dependsOn: ["role"],
    },

    // ── Terms
    {
      name: "terms",
      type: "checkbox",
      label: "I accept the Terms of Service and Privacy Policy",
      colSpan: 12,
      validation: { required: "You must accept the terms to continue" },
    },
    {
      name: "newsletter",
      type: "switch",
      label: "Subscribe to newsletter",
      colSpan: 12,
      defaultValue: false,
    },
  ],
};

export function RegistrationForm() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    const { confirmPassword, ...payload } = values;
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Registration failed");
    console.log("Registered!", payload);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>
      <RavenForm
        schema={registrationSchema}
        adapter={RHFAdapter}
        ui={ShadCNUIAdapter}
        onSubmit={handleSubmit}
        submitLabel="Create Account"
        showStateInspector={process.env.NODE_ENV === "development"}
      />
    </div>
  );
}
```

---

## How it works internally

`RHFAdapter` wraps your form in a React Hook Form `FormProvider` and maps each Raven Form field to a `useController` binding:

```
RavenForm
  └── RHFAdapter.FormProvider
        └── <form onSubmit={handleSubmit}>
              ├── SmartField (useController → FieldBinding)
              ├── SmartField (useController → FieldBinding)
              └── Submit button
```

### Validation rules

`RHFAdapter` converts the `FieldValidation` schema to native RHF `rules` using the internal `buildRHFRules()` utility:

| FieldValidation           | RHF rule                              |
| ------------------------- | ------------------------------------- |
| `required`                | `rules.required`                      |
| `min` / `max`             | `rules.min` / `rules.max`             |
| `minLength` / `maxLength` | `rules.minLength` / `rules.maxLength` |
| `pattern`                 | `rules.pattern`                       |
| `custom` + `asyncCustom`  | `rules.validate` (async combined)     |

### Default values

Default values are extracted from each `FormField.defaultValue` and merged with any `defaultValues` passed as a prop. They are passed to `useForm({ defaultValues })`.

### Validation mode

`RHFAdapter` uses `mode: "onChange"` — errors appear in real time as the user types.

---

## Using `defaultValues` at runtime

Pass runtime data (e.g. from a server) to pre-fill the form:

```tsx
const { data: user } = useSWR('/api/me', fetcher)

<RavenForm
  schema={editProfileSchema}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSave}
  defaultValues={user ?? {}}
/>
```

---

## **`useTrigger`** — step validation for wizards

`RHFAdapter` implements the optional `useTrigger` method, which `RavenWizard` uses to validate the current step's fields before allowing the user to advance:

```ts
// Internally called by RavenWizard when "Next" is clicked:
const trigger = adapter.useTrigger?.();
const valid = await trigger?.(currentStepFieldNames);
if (valid) goToNextStep();
```

---

## State inspector

Set `showStateInspector={true}` on any `RavenForm` or `RavenWizard` to see a live JSON panel of the current form state — powered by `adapter.useWatch()`:

```tsx
<RavenForm
  schema={schema}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
  showStateInspector
/>
```
