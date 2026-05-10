import React, { useState } from "react";
import { RavenWizardForm } from "../../src/form-engine copy/index";
import type { WizardStep } from "../../src/form-engine copy/index";
import { demoFormAdapter, demoUIAdapter } from "./demoAdapter";

const steps: WizardStep[] = [
  {
    id: "company",
    title: "Company Info",
    icon: "🏢",
    fields: [
      { name: "companyName", type: "text",   label: "Company Name", colSpan: 12, validation: { required: true } },
      {
        name: "industry", type: "select", label: "Industry", colSpan: 6,
        options: [
          { label: "Technology", value: "tech" },
          { label: "Healthcare", value: "health" },
          { label: "Finance",    value: "finance" },
          { label: "Education",  value: "edu" },
        ],
      },
      {
        name: "size", type: "radio", label: "Company Size", colSpan: 6, defaultValue: "small",
        options: [
          { label: "1–10",  value: "small" },
          { label: "11–50", value: "medium" },
          { label: "50+",   value: "large" },
        ],
      },
    ],
  },
  {
    id: "account",
    title: "Admin Account",
    icon: "🔑",
    fields: [
      { name: "adminName",  type: "text",     label: "Full Name", colSpan: 12, validation: { required: true } },
      { name: "adminEmail", type: "email",    label: "Email",     colSpan: 6,  validation: { required: true } },
      { name: "adminPass",  type: "password", label: "Password",  colSpan: 6,  validation: { required: true, minLength: 8 } },
    ],
  },
  {
    id: "plan",
    title: "Choose Plan",
    icon: "✨",
    fields: [
      {
        name: "plan", type: "radio", label: "Plan", colSpan: 12, defaultValue: "free",
        options: [
          { label: "Free",       value: "free" },
          { label: "Pro",        value: "pro" },
          { label: "Enterprise", value: "enterprise" },
        ],
      },
      { name: "coupon", type: "text", label: "Coupon (optional)", colSpan: 6 },
    ],
  },
];

export function WizardDemo() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [key, setKey] = useState(0);

  if (result) {
    return (
      <div style={{ padding: "16px", borderRadius: "10px", background: "var(--vp-c-bg-soft)", border: "1px solid #ede9fe", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ fontWeight: 700, color: "#8b5cf6", marginBottom: "10px" }}>✅ Registration Complete!</div>
        <pre style={{ margin: 0, fontSize: "13px", whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
        <button onClick={() => { setResult(null); setKey((k) => k + 1); }} style={{ marginTop: "14px", padding: "7px 18px", borderRadius: "8px", background: "#8b5cf6", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>Reset</button>
      </div>
    );
  }

  return (
    <RavenWizardForm
      key={key}
      steps={steps}
      adapter={demoFormAdapter}
      ui={demoUIAdapter}
      onSubmit={setResult}
      submitLabel="Create Account"
    />
  );
}
