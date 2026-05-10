# Getting Started

**Raven Form** is a schema-driven, adapter-based form engine for React. Describe your form once, choose a form-state library and a UI kit, and Raven Form handles the rest.

## Installation

```bash
# npm
npm install raven-form react-hook-form

# pnpm
pnpm add raven-form react-hook-form
```

> **UI peer dependencies** — install the adapter for the UI library you prefer:
>
> ```bash
> # ShadCN/ui (recommended — Tailwind-based)
> npm install @shadcn/ui
>
> # Ant Design
> npm install antd
> ```

---

## Your first form

### 1. Define a schema

```ts
import type { FormSchema } from "raven-form";

const schema: FormSchema = {
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      colSpan: 6,
      validation: { required: "First name is required" },
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      colSpan: 6,
      validation: { required: true },
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      colSpan: 12,
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: "role",
      type: "select",
      label: "Role",
      colSpan: 6,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
    {
      name: "active",
      type: "switch",
      label: "Active Account",
      colSpan: 6,
      defaultValue: true,
    },
  ],
};
```

### 2. Render with `RavenForm`

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

export function UserForm() {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log("Submitted:", values);
  };

  return (
    <RavenForm
      schema={schema}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={handleSubmit}
      submitLabel="Save User"
    />
  );
}
```

That is all — Raven Form renders a validated, accessible form with a responsive 12-column grid.

---

## Global setup with `RavenFormProvider`

Instead of passing `adapter` and `ui` on every `<RavenForm>` component, wrap your application once with `<RavenFormProvider>` and set them globally:

```tsx
// main.tsx (or App root)
import { RavenFormProvider } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RavenFormProvider formAdapter={RHFAdapter} uiAdapter={ShadCNUIAdapter}>
    <App />
  </RavenFormProvider>,
);
```

Any `<RavenForm>`, `<RavenWizardForm>`, or `<RavenRepeaterField>` component nested under the provider will automatically inherit the configured adapters — no need to repeat them per form:

```tsx
// UserForm.tsx — no adapter or ui props needed
import { RavenForm } from "raven-form";

export function UserForm() {
  return (
    <RavenForm
      schema={schema}
      onSubmit={handleSubmit}
      submitLabel="Save User"
    />
  );
}
```

> **Per-form override:** You can still pass `adapter` or `ui` directly on any individual form to override the provider value for that specific instance.

---

## RavenForm props

| Prop                 | Type                                | Required | Description                              |
| -------------------- | ----------------------------------- | -------- | ---------------------------------------- |
| `schema`             | `FormSchema`                        | ✅       | Field definitions and layout config      |
| `adapter`            | `FormAdapter`                       | ✅       | Form-state library adapter               |
| `ui`                 | `UIAdapter`                         | ✅       | UI component library adapter             |
| `onSubmit`           | `(values) => void \| Promise<void>` | ✅       | Submission handler                       |
| `defaultValues`      | `Record<string, unknown>`           | —        | Runtime default values override          |
| `submitLabel`        | `string`                            | —        | Submit button text (default: `"Submit"`) |
| `showStateInspector` | `boolean`                           | —        | Show live form-state debug panel         |

---

## FormSchema structure

```ts
interface FormSchema {
  fields: FormField[]; // field definitions
  columns?: number; // grid columns (default: 12)
  gap?: string; // gap utility class e.g. "gap-4"
  steps?: WizardStep[]; // wizard steps — used with RavenWizard
}
```

---

## Next steps

- [Field Types](/guide/field-types) — all 25+ supported field types
- [Validation](/guide/validation) — sync, async, pattern, cross-field
- [Form Adapters](/guide/adapters) — RHF, AntD, custom
- [UI Adapters](/guide/ui-adapters) — ShadCN, AntD, custom
- [Wizard Forms](/guide/wizard) — multi-step guided forms
- [Repeater Fields](/guide/repeater) — dynamic row arrays
