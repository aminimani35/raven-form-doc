import React, { useState } from "react";
import { RavenForm } from "../../src/form-engine copy/index";
import type { FormSchema } from "../../src/form-engine copy/index";
import { demoFormAdapter, demoUIAdapter } from "./demoAdapter";

const schema: FormSchema = {
  columns: 12,
  fields: [
    {
      name: "contacts",
      type: "repeater",
      label: "Emergency Contacts",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        maxRows: 5,
        addLabel: "+ Add Contact",
        removeLabel: "Remove",
        defaultRow: { name: "", email: "", role: "user" },
        fields: [
          { name: "name",  type: "text",   label: "Name",  colSpan: 4, validation: { required: true }, placeholder: "Full name" },
          { name: "email", type: "email",  label: "Email", colSpan: 4, placeholder: "email@example.com" },
          {
            name: "role", type: "select", label: "Role", colSpan: 4,
            options: [
              { label: "Admin", value: "admin" },
              { label: "User",  value: "user" },
              { label: "Guest", value: "guest" },
            ],
          },
        ],
      },
    },
  ],
};

export function RepeaterDemo() {
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
        <RavenForm schema={schema} adapter={demoFormAdapter} ui={demoUIAdapter} onSubmit={setResult} submitLabel="Save Contacts" />
      )}
    </div>
  );
}
