import React, { useState } from "react";
import { RavenForm } from "../../src/form-engine copy/index";
import type { FormSchema } from "../../src/form-engine copy/index";
import { demoFormAdapter, demoUIAdapter } from "./demoAdapter";

const schema: FormSchema = {
  columns: 12,
  fields: [
    { name: "firstName", type: "text",     label: "First Name", colSpan: 6,  placeholder: "John",              validation: { required: true } },
    { name: "lastName",  type: "text",     label: "Last Name",  colSpan: 6,  placeholder: "Doe",               validation: { required: true } },
    { name: "email",     type: "email",    label: "Email",      colSpan: 6,  placeholder: "john@company.com",  validation: { required: true } },
    { name: "phone",     type: "tel",      label: "Phone",      colSpan: 6,  placeholder: "+1 (555) 000-0000" },
    {
      name: "department", type: "select", label: "Department", colSpan: 6,
      validation: { required: true },
      options: [
        { label: "Engineering", value: "eng" },
        { label: "Marketing",   value: "mkt" },
        { label: "Finance",     value: "fin" },
        { label: "HR",          value: "hr" },
      ],
    },
    {
      name: "role", type: "select", label: "Role", colSpan: 6,
      options: [
        { label: "Employee", value: "employee" },
        { label: "Manager",  value: "manager" },
        { label: "Director", value: "director" },
      ],
    },
    {
      name: "skills", type: "multiselect", label: "Skills", colSpan: 12,
      options: [
        { label: "React",      value: "react" },
        { label: "TypeScript", value: "ts" },
        { label: "Node.js",    value: "node" },
        { label: "Python",     value: "python" },
        { label: "Design",     value: "design" },
      ],
    },
    { name: "active", type: "switch",    label: "Active Employee", defaultValue: true },
    { name: "bio",    type: "textarea",  label: "Bio",             colSpan: 12, placeholder: "Short bio..." },
  ],
};

export function EmployeeDemo() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {result ? (
        <div style={{ padding: "16px", borderRadius: "10px", background: "var(--vp-c-bg-soft)", border: "1px solid #ede9fe" }}>
          <div style={{ fontWeight: 700, color: "#8b5cf6", marginBottom: "10px" }}>✅ Submitted!</div>
          <pre style={{ margin: 0, fontSize: "13px", whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
          <button onClick={() => setResult(null)} style={{ marginTop: "14px", padding: "7px 18px", borderRadius: "8px", background: "#8b5cf6", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>Reset</button>
        </div>
      ) : (
        <RavenForm schema={schema} adapter={demoFormAdapter} ui={demoUIAdapter} onSubmit={setResult} submitLabel="Save Profile" showReset />
      )}
    </div>
  );
}
