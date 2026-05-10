import React, { useState } from "react";
import { MiniForm, type FieldDef } from "./shared";

interface Step {
  title: string;
  fields: FieldDef[];
}

const steps: Step[] = [
  {
    title: "1. Company Info",
    fields: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        required: true,
        colSpan: 12,
      },
      {
        name: "industry",
        label: "Industry",
        type: "select",
        colSpan: 6,
        options: [
          { label: "Technology", value: "tech" },
          { label: "Healthcare", value: "health" },
          { label: "Finance", value: "finance" },
          { label: "Education", value: "edu" },
        ],
      },
      {
        name: "size",
        label: "Company Size",
        type: "radio",
        colSpan: 6,
        defaultValue: "small",
        options: [
          { label: "1–10", value: "small" },
          { label: "11–50", value: "medium" },
          { label: "50+", value: "large" },
        ],
      },
    ],
  },
  {
    title: "2. Admin Account",
    fields: [
      {
        name: "adminName",
        label: "Full Name",
        type: "text",
        required: true,
        colSpan: 12,
      },
      {
        name: "adminEmail",
        label: "Email",
        type: "email",
        required: true,
        colSpan: 6,
      },
      {
        name: "adminPass",
        label: "Password",
        type: "password",
        required: true,
        colSpan: 6,
        validate: (v) =>
          ((v as string)?.length ?? 0) < 8 ? "Min 8 characters" : undefined,
      },
    ],
  },
  {
    title: "3. Choose Plan",
    fields: [
      {
        name: "plan",
        label: "Plan",
        type: "radio",
        colSpan: 12,
        defaultValue: "free",
        options: [
          { label: "Free", value: "free" },
          { label: "Pro", value: "pro" },
          { label: "Enterprise", value: "enterprise" },
        ],
      },
      { name: "coupon", label: "Coupon (optional)", type: "text", colSpan: 6 },
    ],
  },
];

const stepBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginBottom: "20px",
  flexWrap: "wrap",
};
const stepBtnStyle = (active: boolean, done: boolean): React.CSSProperties => ({
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: 600,
  border: "none",
  cursor: "default",
  background: done
    ? "#ede9fe"
    : active
      ? "#8b5cf6"
      : "var(--vp-c-bg-soft, #f6f6f7)",
  color: done ? "#4c1d95" : active ? "#fff" : "var(--vp-c-text-2, #6b7280)",
});

const wrapStyle: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: "14px",
  color: "var(--vp-c-text-1, #213547)",
};

export function WizardDemo() {
  const [step, setStep] = useState(0);
  const [allData, setAllData] = useState<Record<string, unknown>>({});
  const [done, setDone] = useState(false);

  const handleStep = (data: Record<string, unknown>) => {
    const merged = { ...allData, ...data };
    setAllData(merged);
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={stepBarStyle}>
        {steps.map((st, i) => (
          <span key={i} style={stepBtnStyle(i === step, i < step || done)}>
            {st.title}
          </span>
        ))}
      </div>

      {!done ? (
        <div>
          <MiniForm
            key={step}
            columns={12}
            fields={steps[step].fields}
            submitLabel={step < steps.length - 1 ? "Next →" : "Finish"}
            onSubmit={handleStep}
          />
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{
                marginTop: "8px",
                marginLeft: "12px",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid var(--vp-c-divider, #e2e2e3)",
                background: "transparent",
                cursor: "pointer",
                fontSize: "13px",
                color: "var(--vp-c-text-2, #6b7280)",
              }}
            >
              ← Back
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: "16px",
            borderRadius: "10px",
            background: "var(--vp-c-bg-soft, #f6f6f7)",
            border: "1px solid #ede9fe",
          }}
        >
          <div
            style={{ fontWeight: 700, color: "#8b5cf6", marginBottom: "10px" }}
          >
            ✅ Registration Complete!
          </div>
          <pre style={{ margin: 0, fontSize: "13px", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(allData, null, 2)}
          </pre>
          <button
            onClick={() => {
              setStep(0);
              setAllData({});
              setDone(false);
            }}
            style={{
              marginTop: "14px",
              padding: "7px 18px",
              borderRadius: "8px",
              background: "#8b5cf6",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
