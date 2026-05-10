import React from "react";
import { MiniForm } from "./shared";

export function EmployeeDemo() {
  return (
    <MiniForm
      columns={12}
      submitLabel="Save Profile"
      fields={[
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          colSpan: 6,
          placeholder: "John",
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          colSpan: 6,
          placeholder: "Doe",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          colSpan: 6,
          placeholder: "john@company.com",
        },
        {
          name: "phone",
          label: "Phone",
          type: "tel",
          colSpan: 6,
          placeholder: "+1 (555) 000-0000",
        },
        {
          name: "department",
          label: "Department",
          type: "select",
          required: true,
          colSpan: 6,
          options: [
            { label: "Engineering", value: "eng" },
            { label: "Marketing", value: "mkt" },
            { label: "Finance", value: "fin" },
            { label: "HR", value: "hr" },
          ],
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          colSpan: 6,
          options: [
            { label: "Employee", value: "employee" },
            { label: "Manager", value: "manager" },
            { label: "Director", value: "director" },
          ],
        },
        {
          name: "skills",
          label: "Skills",
          type: "multiselect",
          colSpan: 12,
          options: [
            { label: "React", value: "react" },
            { label: "TypeScript", value: "ts" },
            { label: "Node.js", value: "node" },
            { label: "Python", value: "python" },
            { label: "Design", value: "design" },
          ],
        },
        {
          name: "active",
          label: "Active Employee",
          type: "switch",
          colSpan: 6,
          defaultValue: true,
        },
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
          colSpan: 12,
          placeholder: "Short bio...",
        },
      ]}
    />
  );
}
