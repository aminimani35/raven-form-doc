# Ant Design Examples

These examples use **`AntDAdapter`** (form state) and **`AntDUIAdapter`** (UI components) together with Raven Form. [Ant Design](https://ant.design/) gives you enterprise-grade components with a polished look out of the box.

## Setup

```bash
npm install antd @ant-design/icons
```

```tsx
import { RavenForm } from "raven-form";
import { AntDAdapter } from "raven-form/adapters/antd";
import { AntDUIAdapter } from "raven-form/ui/antd";
```

---

## Example 1 — Login form

```tsx
import { RavenForm } from "raven-form";
import { AntDAdapter } from "raven-form/adapters/antd";
import { AntDUIAdapter } from "raven-form/ui/antd";
import { Card } from "antd";
import type { FormSchema } from "raven-form";

const loginSchema: FormSchema = {
  fields: [
    {
      name: "email",
      type: "email",
      label: "Email Address",
      colSpan: 12,
      placeholder: "you@example.com",
      validation: {
        required: "Please enter your email",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      colSpan: 12,
      placeholder: "••••••••",
      validation: { required: "Please enter your password" },
    },
    {
      name: "remember",
      type: "checkbox",
      label: "Remember me",
      colSpan: 12,
      defaultValue: false,
    },
  ],
};

export function LoginForm() {
  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <Card title="Sign In" bordered>
        <RavenForm
          schema={loginSchema}
          adapter={AntDAdapter}
          ui={AntDUIAdapter}
          onSubmit={async ({ email, password }) => {
            await signIn(email as string, password as string);
          }}
          submitLabel="Sign In"
        />
      </Card>
    </div>
  );
}
```

<FormDemo demo="LoginDemo" />

---

## Example 2 — Employee profile

```tsx
import { RavenForm } from "raven-form";
import { AntDAdapter } from "raven-form/adapters/antd";
import { AntDUIAdapter } from "raven-form/ui/antd";
import type { FormSchema } from "raven-form";

const employeeSchema: FormSchema = {
  fields: [
    // ── Identity
    {
      name: "avatar",
      type: "file",
      label: "Profile Photo",
      colSpan: 12,
    },
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      colSpan: 4,
      validation: { required: true },
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      colSpan: 4,
      validation: { required: true },
    },
    {
      name: "nationalId",
      type: "text",
      label: "National ID",
      colSpan: 4,
      mask: "nationalCode",
      validation: {
        required: true,
        pattern: /^\d{10}$/,
      },
    },

    // ── Contact
    {
      name: "phone",
      type: "tel",
      label: "Mobile",
      colSpan: 6,
      mask: "phone",
      validation: { required: true },
    },
    {
      name: "email",
      type: "email",
      label: "Work Email",
      colSpan: 6,
      validation: { required: true },
    },

    // ── Department
    {
      name: "department",
      type: "select",
      label: "Department",
      colSpan: 4,
      validation: { required: true },
      options: [
        { label: "Engineering", value: "eng" },
        { label: "Design", value: "design" },
        { label: "Product", value: "product" },
        { label: "Marketing", value: "marketing" },
        { label: "HR", value: "hr" },
        { label: "Finance", value: "finance" },
      ],
    },
    {
      name: "jobTitle",
      type: "text",
      label: "Job Title",
      colSpan: 4,
      validation: { required: true },
    },
    {
      name: "startDate",
      type: "date",
      label: "Start Date",
      colSpan: 4,
      validation: { required: true },
    },

    // ── Salary
    {
      name: "baseSalary",
      type: "text",
      label: "Base Salary (Toman)",
      colSpan: 6,
      mask: "currency",
      parser: (v) => Number(String(v).replace(/[^\d]/g, "")),
      validation: { required: true },
    },
    {
      name: "contractType",
      type: "radio",
      label: "Contract Type",
      colSpan: 6,
      defaultValue: "full-time",
      options: [
        { label: "Full-time", value: "full-time" },
        { label: "Part-time", value: "part-time" },
        { label: "Contractor", value: "contractor" },
      ],
    },

    // ── Skills
    {
      name: "skills",
      type: "multiselect",
      label: "Skills",
      colSpan: 12,
      options: [
        { label: "React", value: "react" },
        { label: "TypeScript", value: "ts" },
        { label: "Node.js", value: "node" },
        { label: "Python", value: "python" },
        { label: "Docker", value: "docker" },
        { label: "Figma", value: "figma" },
        { label: "SQL", value: "sql" },
      ],
    },

    // ── Notes
    {
      name: "notes",
      type: "textarea",
      label: "Notes",
      colSpan: 12,
    },
    {
      name: "active",
      type: "switch",
      label: "Active Employee",
      defaultValue: true,
    },
  ],
};

export function EmployeeProfile({
  employee,
}: {
  employee?: Record<string, unknown>;
}) {
  return (
    <RavenForm
      schema={employeeSchema}
      adapter={AntDAdapter}
      ui={AntDUIAdapter}
      onSubmit={async (values) => {
        await saveEmployee(values);
      }}
      defaultValues={employee}
      submitLabel={employee ? "Update Profile" : "Add Employee"}
    />
  );
}
```

<FormDemo demo="EmployeeDemo" />

---

## Example 3 — Multi-step onboarding wizard

```tsx
import { RavenWizardForm } from "raven-form";
import { AntDAdapter } from "raven-form/adapters/antd";
import { AntDUIAdapter } from "raven-form/ui/antd";
import type { FormSchema } from "raven-form";

const onboardingSchema: FormSchema = {
  fields: [],
  steps: [
    {
      id: "company",
      title: "Company",
      icon: "solar:buildings-bold",
      fields: [
        {
          name: "companyName",
          type: "text",
          label: "Company Name",
          colSpan: 8,
          validation: { required: true },
        },
        {
          name: "industry",
          type: "select",
          label: "Industry",
          colSpan: 4,
          options: [
            { label: "Technology", value: "tech" },
            { label: "Healthcare", value: "health" },
            { label: "Finance", value: "finance" },
            { label: "Retail", value: "retail" },
          ],
        },
        {
          name: "size",
          type: "radio",
          label: "Company Size",
          colSpan: 12,
          defaultValue: "1-10",
          options: [
            { label: "1–10", value: "1-10" },
            { label: "11–50", value: "11-50" },
            { label: "51–200", value: "51-200" },
            { label: "200+", value: "200+" },
          ],
        },
      ],
    },
    {
      id: "admin",
      title: "Admin Account",
      icon: "solar:user-bold",
      fields: [
        {
          name: "adminName",
          type: "text",
          label: "Full Name",
          colSpan: 6,
          validation: { required: true },
        },
        {
          name: "adminEmail",
          type: "email",
          label: "Email",
          colSpan: 6,
          validation: { required: true },
        },
        {
          name: "adminPass",
          type: "password",
          label: "Password",
          colSpan: 6,
          validation: { required: true, minLength: 8 },
        },
        {
          name: "adminPass2",
          type: "password",
          label: "Confirm Password",
          colSpan: 6,
          validation: {
            required: true,
            custom: (v, fv) =>
              v === fv.adminPass ? null : "Passwords do not match",
          },
          dependsOn: ["adminPass"],
        },
      ],
    },
    {
      id: "plan",
      title: "Choose Plan",
      icon: "solar:star-bold",
      fields: [
        {
          name: "plan",
          type: "radio",
          label: "Plan",
          colSpan: 12,
          defaultValue: "starter",
          options: [
            { label: "🌱 Starter — Free forever", value: "starter" },
            { label: "🚀 Pro — $29/mo", value: "pro" },
            { label: "🏢 Enterprise — Contact us", value: "enterprise" },
          ],
        },
        {
          name: "promoCode",
          type: "text",
          label: "Promo Code",
          colSpan: 6,
          hidden: (v) => v.plan === "starter",
          dependsOn: ["plan"],
          formatter: "upper",
        },
        {
          name: "agreeTerms",
          type: "checkbox",
          label: "I agree to the Terms of Service",
          colSpan: 12,
          validation: { required: "You must agree to continue" },
        },
      ],
    },
  ],
};

export function OnboardingWizard() {
  return (
    <RavenWizardForm
      schema={onboardingSchema}
      adapter={AntDAdapter}
      ui={AntDUIAdapter}
      onSubmit={async (values) => {
        await registerOrganization(values);
      }}
      submitLabel="Launch 🚀"
    />
  );
}
```

<FormDemo demo="WizardDemo" />

---

## Example 4 — Dynamic contacts repeater

```tsx
import { RavenForm } from "raven-form";
import { AntDAdapter } from "raven-form/adapters/antd";
import { AntDUIAdapter } from "raven-form/ui/antd";

const contactsSchema = {
  fields: [
    {
      name: "contacts",
      type: "repeater" as const,
      label: "Contacts",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        maxRows: 10,
        addLabel: "+ Add Contact",
        defaultRow: { name: "", email: "", phone: "" },
        fields: [
          {
            name: "name",
            type: "text" as const,
            label: "Name",
            colSpan: 4,
            validation: { required: true },
          },
          {
            name: "email",
            type: "email" as const,
            label: "Email",
            colSpan: 4,
            validation: { required: true },
          },
          {
            name: "phone",
            type: "tel" as const,
            label: "Phone",
            colSpan: 4,
            mask: "phone",
          },
        ],
      },
    },
  ],
};

export function ContactsForm() {
  return (
    <RavenForm
      schema={contactsSchema}
      adapter={AntDAdapter}
      ui={AntDUIAdapter}
      onSubmit={(values) => console.log(values)}
      submitLabel="Save Contacts"
    />
  );
}
```

<FormDemo demo="RepeaterDemo" />
