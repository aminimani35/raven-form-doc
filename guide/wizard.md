# Wizard Forms

`RavenWizard` renders a multi-step guided form. It splits fields into named **steps**, shows a progress bar, validates each step before advancing, and calls `onSubmit` only on the final step.

## Quick example

```tsx
import { RavenWizardForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const schema = {
  steps: [
    {
      id: "personal",
      title: "Personal Info",
      icon: "solar:user-bold",
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "First Name",
          colSpan: 6,
          validation: { required: true },
        },
        {
          name: "lastName",
          type: "text",
          label: "Last Name",
          colSpan: 6,
          validation: { required: true },
        },
        { name: "dob", type: "date", label: "Date of Birth", colSpan: 6 },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      icon: "solar:phone-bold",
      fields: [
        {
          name: "email",
          type: "email",
          label: "Email",
          colSpan: 12,
          validation: { required: true },
        },
        {
          name: "phone",
          type: "tel",
          label: "Phone",
          colSpan: 6,
          mask: "phone",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      icon: "solar:check-circle-bold",
      fields: [
        {
          name: "agree",
          type: "checkbox",
          label: "I agree to the terms",
          validation: { required: "You must accept the terms" },
        },
      ],
    },
  ],
  // top-level fields are ignored when steps are present
  fields: [],
};

export function RegistrationWizard() {
  return (
    <RavenWizardForm
      schema={schema}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={async (values) => {
        await registerUser(values);
      }}
      submitLabel="Complete Registration"
    />
  );
}
```

---

## `WizardStep` interface

```ts
interface WizardStep {
  id: string; // unique step identifier
  title: string; // displayed in the progress bar
  description?: string; // optional subtitle
  icon?: string; // Iconify icon name shown in the step circle
  fields: FormField[]; // fields rendered in this step
  columns?: number; // grid column override for this step (default: 12)
}
```

---

## `RavenWizardProps`

```ts
interface RavenWizardProps {
  schema: FormSchema; // must include a `steps` array
  adapter: FormAdapter;
  ui: UIAdapter;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string; // label for the final step's submit button
  showStateInspector?: boolean;
}
```

---

## Step progress bar

The `StepBar` component is rendered automatically at the top of the wizard. It shows:

- ⬜ **Upcoming steps** — grayed out
- 🔵 **Current step** — highlighted in brand color with a ring
- ✅ **Completed steps** — filled in emerald green with a checkmark

Connector lines between steps turn green as each step is completed.

---

## Step validation

When the user clicks **Next**, `RavenWizard` calls `adapter.useTrigger()` to validate only the fields in the current step. The user cannot advance until all required fields in the current step pass validation.

::: tip
The `useTrigger` hook is optional on the `FormAdapter` interface. If it is not provided, the wizard will advance without step-level validation.
:::

---

## Navigation

The wizard provides:

- **Back** button — always visible except on the first step
- **Next** button — validates current step and advances
- **Submit** button — appears only on the last step

All navigation state is managed internally so you don't need to wire up any state yourself.

---

## Default values

Pass `defaultValues` as a flat object using the same field names defined across all steps:

```tsx
<RavenWizardForm
  schema={schema}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
  defaultValues={{
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
  }}
/>
```
