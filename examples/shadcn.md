# ShadCN / ui Examples

These examples use **`RHFAdapter`** (form state) and **`ShadCNUIAdapter`** (UI components). [ShadCN/ui](https://ui.shadcn.com/) is a collection of beautifully designed, accessible components built on Tailwind CSS and Radix UI.

## Setup

```bash
# Install shadcn/ui components you need
npx shadcn@latest add input textarea select checkbox switch button label
npm install react-hook-form
```

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";
```

---

## Example 1 — Sign-up form

<FormDemoTabs demo="SignupDemo">

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";
import type { FormSchema } from "raven-form";

const signUpSchema: FormSchema = {
  fields: [
    {
      name: "displayName",
      type: "text",
      label: "Display Name",
      colSpan: 12,
      placeholder: "Jane Doe",
      validation: { required: true, minLength: 2 },
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      colSpan: 12,
      placeholder: "jane@example.com",
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        asyncCustom: async (v) => {
          // Simulate uniqueness check
          await new Promise((r) => setTimeout(r, 400));
          return v === "taken@example.com" ? "Email already in use" : null;
        },
      },
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      colSpan: 6,
      placeholder: "At least 8 characters",
      validation: {
        required: true,
        minLength: 8,
        custom: (v) =>
          /[A-Z]/.test(v as string)
            ? null
            : "Must contain at least one uppercase letter",
      },
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      colSpan: 6,
      placeholder: "Repeat password",
      validation: {
        required: true,
        custom: (v, fv) =>
          v === fv.password ? null : "Passwords do not match",
      },
      dependsOn: ["password"],
    },
    {
      name: "terms",
      type: "checkbox",
      label: "I accept the Terms of Service",
      colSpan: 12,
      validation: { required: "You must accept the terms" },
    },
  ],
};

export function SignUpForm() {
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-card rounded-2xl shadow-lg border">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Free forever. No credit card needed.
        </p>
      </div>
      <RavenForm
        schema={signUpSchema}
        adapter={RHFAdapter}
        ui={ShadCNUIAdapter}
        onSubmit={async ({ confirmPassword, ...values }) => {
          await createAccount(values);
        }}
        submitLabel="Create Account"
      />
    </div>
  );
}
```

</FormDemoTabs>

---

## Example 2 — Settings page

<FormDemoTabs demo="SettingsDemo">

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";
import type { FormSchema } from "raven-form";

const settingsSchema: FormSchema = {
  fields: [
    // ── Profile
    {
      name: "displayName",
      type: "text",
      label: "Display Name",
      colSpan: 6,
      validation: { required: true },
    },
    {
      name: "username",
      type: "text",
      label: "Username",
      colSpan: 6,
      description: "Only letters, numbers, and underscores",
      formatter: "lower",
      validation: {
        required: true,
        pattern: /^[a-z0-9_]{3,20}$/,
        asyncCustom: async (v) => {
          const res = await fetch(`/api/check-username?u=${v}`);
          const { available } = await res.json();
          return available ? null : "Username already taken";
        },
      },
    },
    {
      name: "bio",
      type: "textarea",
      label: "Bio",
      colSpan: 12,
      description: "Tell us a little about yourself",
      validation: { maxLength: 200 },
    },
    {
      name: "website",
      type: "url",
      label: "Website",
      colSpan: 6,
      placeholder: "https://yoursite.com",
    },
    {
      name: "timezone",
      type: "select",
      label: "Timezone",
      colSpan: 6,
      options: [
        { label: "(UTC+03:30) Tehran", value: "Asia/Tehran" },
        { label: "(UTC+00:00) London", value: "Europe/London" },
        { label: "(UTC-05:00) New York", value: "America/New_York" },
        { label: "(UTC-08:00) Los Angeles", value: "America/Los_Angeles" },
        { label: "(UTC+01:00) Paris", value: "Europe/Paris" },
        { label: "(UTC+09:00) Tokyo", value: "Asia/Tokyo" },
      ],
    },

    // ── Notifications
    {
      name: "emailNotifications",
      type: "switch",
      label: "Email notifications",
      defaultValue: true,
    },
    {
      name: "pushNotifications",
      type: "switch",
      label: "Push notifications",
      defaultValue: false,
    },
    {
      name: "notifyFrequency",
      type: "select",
      label: "Notification frequency",
      colSpan: 6,
      defaultValue: "daily",
      hidden: (v) => !v.emailNotifications,
      dependsOn: ["emailNotifications"],
      options: [
        { label: "Immediately", value: "instant" },
        { label: "Daily digest", value: "daily" },
        { label: "Weekly digest", value: "weekly" },
      ],
    },

    // ── Account
    {
      name: "language",
      type: "select",
      label: "Interface Language",
      colSpan: 6,
      defaultValue: "en",
      options: [
        { label: "English", value: "en" },
        { label: "فارسی", value: "fa" },
        { label: "Français", value: "fr" },
        { label: "Español", value: "es" },
        { label: "日本語", value: "ja" },
      ],
    },
    {
      name: "theme",
      type: "radio",
      label: "Theme",
      colSpan: 6,
      defaultValue: "system",
      options: [
        { label: "☀️ Light", value: "light" },
        { label: "🌙 Dark", value: "dark" },
        { label: "💻 System", value: "system" },
      ],
    },
  ],
};

export function SettingsPage({
  currentUser,
}: {
  currentUser: Record<string, unknown>;
}) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <RavenForm
        schema={settingsSchema}
        adapter={RHFAdapter}
        ui={ShadCNUIAdapter}
        onSubmit={async (values) => {
          await updateProfile(values);
        }}
        defaultValues={currentUser}
        submitLabel="Save Changes"
      />
    </div>
  );
}
```

</FormDemoTabs>

---

## Example 3 — Invoice builder with repeater

<FormDemoTabs demo="RepeaterDemo">

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const invoiceSchema = {
  fields: [
    // ── Header
    {
      name: "clientName",
      type: "text" as const,
      label: "Client Name",
      colSpan: 6,
      validation: { required: true },
    },
    {
      name: "invoiceDate",
      type: "date" as const,
      label: "Invoice Date",
      colSpan: 3,
      validation: { required: true },
    },
    {
      name: "dueDate",
      type: "date" as const,
      label: "Due Date",
      colSpan: 3,
      validation: { required: true },
    },

    // ── Line items
    {
      name: "lineItems",
      type: "repeater" as const,
      label: "Line Items",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        maxRows: 20,
        addLabel: "+ Add Item",
        defaultRow: { description: "", qty: 1, unitPrice: "" },
        fields: [
          {
            name: "description",
            type: "text" as const,
            label: "Description",
            colSpan: 5,
            validation: { required: true },
          },
          {
            name: "qty",
            type: "number" as const,
            label: "Qty",
            colSpan: 2,
            validation: { required: true, min: 1 },
            defaultValue: 1,
          },
          {
            name: "unitPrice",
            type: "text" as const,
            label: "Unit Price",
            colSpan: 3,
            mask: "currency",
            validation: { required: true },
          },
          {
            name: "taxRate",
            type: "number" as const,
            label: "Tax %",
            colSpan: 2,
            defaultValue: 0,
          },
        ],
      },
    },

    // ── Notes
    {
      name: "notes",
      type: "textarea" as const,
      label: "Notes",
      colSpan: 12,
      placeholder: "Payment terms, bank information...",
    },
  ],
};

export function InvoiceBuilder() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">New Invoice</h1>
      <RavenForm
        schema={invoiceSchema}
        adapter={RHFAdapter}
        ui={ShadCNUIAdapter}
        onSubmit={(values) => console.log("Invoice:", values)}
        submitLabel="Generate Invoice"
        showStateInspector
      />
    </div>
  );
}
```

</FormDemoTabs>

---

## Example 4 — Color/Rating custom fields

<FormDemoTabs demo="FeedbackDemo">

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const feedbackSchema = {
  fields: [
    {
      name: "rating",
      type: "rating" as const,
      label: "How would you rate your experience?",
      colSpan: 12,
      validation: { required: "Please rate your experience" },
    },
    {
      name: "nps",
      type: "range" as const,
      label: "How likely are you to recommend us? (0–10)",
      colSpan: 12,
      defaultValue: 7,
      validation: { min: 0, max: 10 },
    },
    {
      name: "category",
      type: "radio" as const,
      label: "Feedback category",
      colSpan: 12,
      options: [
        { label: "🐛 Bug Report", value: "bug" },
        { label: "💡 Feature Request", value: "feature" },
        { label: "🌟 General Feedback", value: "general" },
      ],
    },
    {
      name: "message",
      type: "textarea" as const,
      label: "Your message",
      colSpan: 12,
      validation: { required: true, minLength: 20 },
    },
    {
      name: "accentColor",
      type: "color" as const,
      label: "Preferred accent color",
      colSpan: 4,
      defaultValue: "#10b981",
    },
    {
      name: "allowContact",
      type: "switch" as const,
      label: "Allow us to contact you about this feedback",
      defaultValue: true,
    },
    {
      name: "contactEmail",
      type: "email" as const,
      label: "Contact email",
      colSpan: 6,
      hidden: (v) => !v.allowContact,
      dependsOn: ["allowContact"],
      validation: {
        custom: (v, fv) => (fv.allowContact && !v ? "Email is required" : null),
      },
    },
  ],
};

export function FeedbackForm() {
  return (
    <RavenForm
      schema={feedbackSchema}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={(values) => console.log("Feedback:", values)}
      submitLabel="Submit Feedback"
    />
  );
}
```

</FormDemoTabs>
