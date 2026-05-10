import React, { useState } from "react";

interface Contact {
  name: string;
  email: string;
  role: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  borderRadius: "7px",
  fontSize: "13px",
  border: "1px solid var(--vp-c-divider, #c2c2c4)",
  background: "var(--vp-c-bg, #fff)",
  color: "var(--vp-c-text-1, #213547)",
  outline: "none",
  boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 500,
  display: "block",
  marginBottom: "4px",
};

const btnStyle = (
  variant: "primary" | "danger" | "ghost",
): React.CSSProperties => ({
  padding: "6px 14px",
  borderRadius: "7px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  border: "none",
  background:
    variant === "primary"
      ? "#8b5cf6"
      : variant === "danger"
        ? "#fee2e2"
        : "var(--vp-c-bg-soft, #f6f6f7)",
  color:
    variant === "primary"
      ? "#fff"
      : variant === "danger"
        ? "#dc2626"
        : "var(--vp-c-text-1, #213547)",
});

function emptyContact(): Contact {
  return { name: "", email: "", role: "user" };
}

export function RepeaterDemo() {
  const [rows, setRows] = useState<Contact[]>([emptyContact()]);
  const [submitted, setSubmitted] = useState<Contact[] | null>(null);

  const setRow = (i: number, field: keyof Contact, val: string) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)),
    );

  const addRow = () => setRows((prev) => [...prev, emptyContact()]);
  const removeRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(rows);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "14px",
        color: "var(--vp-c-text-1, #213547)",
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 120px auto",
                gap: "10px",
                alignItems: "end",
                padding: "12px",
                borderRadius: "10px",
                background: "var(--vp-c-bg-soft, #f6f6f7)",
                border: "1px solid var(--vp-c-divider, #e2e2e3)",
              }}
            >
              <div>
                <label style={labelStyle}>Name *</label>
                <input
                  style={inputStyle}
                  value={row.name}
                  placeholder="Full name"
                  onChange={(e) => setRow(i, "name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={row.email}
                  placeholder="email@example.com"
                  onChange={(e) => setRow(i, "email", e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <select
                  style={selectStyle}
                  value={row.role}
                  onChange={(e) => setRow(i, "role", e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <div>
                <button
                  type="button"
                  style={btnStyle("danger")}
                  disabled={rows.length === 1}
                  onClick={() => removeRow(i)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <button type="button" style={btnStyle("ghost")} onClick={addRow}>
            + Add Contact
          </button>
          <button type="submit" style={btnStyle("primary")}>
            Save Contacts
          </button>
        </div>
      </form>

      {submitted && (
        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            borderRadius: "10px",
            background: "var(--vp-c-bg-soft, #f6f6f7)",
            border: "1px solid var(--vp-c-divider, #e2e2e3)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#8b5cf6",
              marginBottom: "8px",
              fontSize: "12px",
            }}
          >
            ✅ SUBMITTED VALUES
          </div>
          <pre style={{ margin: 0, fontSize: "13px", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
