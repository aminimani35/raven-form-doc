# RavenWizard

`RavenWizardForm` renders a schema as a multi-step guided wizard. It handles step progression, per-step validation gating, and automatic step completion tracking.

## Import

```ts
import { RavenWizardForm } from "raven-form";
```

## Props

```ts
interface RavenWizardFormProps {
  steps: WizardStep[];
  /** Optional — falls back to formAdapter in <RavenFormProvider>. */
  adapter?: FormAdapter;
  /** Optional — falls back to uiAdapter in <RavenFormProvider>. */
  ui?: UIAdapter;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  showStateInspector?: boolean;
}
```

| Prop                 | Type                                | Default    | Description                          |
| -------------------- | ----------------------------------- | ---------- | ------------------------------------ |
| `steps`              | `WizardStep[]`                      | —            | Array of step definitions with their fields |
| `adapter`            | `FormAdapter`                       | *(provider)* | Form-state adapter. Inherits from `<RavenFormProvider>` when omitted. |
| `ui`                 | `UIAdapter`                         | *(provider)* | UI component adapter. Inherits from `<RavenFormProvider>` when omitted. |
| `onSubmit`           | `(values) => void \| Promise<void>` | —          | Final submission handler             |
| `defaultValues`      | `Record<string, unknown>`           | `{}`       | Pre-fill values across all steps     |
| `submitLabel`        | `string`                            | `"Submit"` | Submit button label on the last step |
| `showStateInspector` | `boolean`                           | `false`    | Show live JSON state debug panel     |

## Example

```tsx
const steps = [
  {
    id: "step1",
    title: "Account",
    fields: [
      { name: "email",    type: "email",    label: "Email",    validation: { required: true } },
      { name: "password", type: "password", label: "Password", validation: { required: true, minLength: 8 } },
    ],
  },
  {
    id: "step2",
    title: "Profile",
    fields: [
      { name: "displayName", type: "text",     label: "Display Name", colSpan: 6 },
      { name: "bio",         type: "textarea", label: "Bio",          colSpan: 12 },
    ],
  },
];

// With per-form adapters:
<RavenWizardForm
  steps={steps}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={handleSubmit}
  submitLabel="Create Account"
/>

// Or using a <RavenFormProvider> — no adapter/ui needed:
<RavenWizardForm
  steps={steps}
  onSubmit={handleSubmit}
  submitLabel="Create Account"
/>
```

## `StepBar` component

The step progress bar is rendered automatically. Each step shows:

- **Pending** — gray circle with step number or `icon`
- **Current** — brand-colored circle with a ring
- **Completed** — checkmark (✓) circle

Connector lines between steps turn green as each step is completed.

## State machine

```
┌──────────┐  Next (valid)  ┌──────────┐  Next (valid)  ┌──────────┐
│  Step 0  │ ─────────────► │  Step 1  │ ─────────────► │  Step N  │
│ (current)│ ◄───────────── │          │                │  Submit  │
└──────────┘    Back        └──────────┘                └──────────┘
```

Completed steps are tracked in a `Set<number>` so going back and returning does not reset progress.
