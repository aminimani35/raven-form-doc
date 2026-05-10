import React, { useState, useCallback, useRef } from "react";

// ── Minimal type definitions ──────────────────────────────────────────────────
export interface FieldDef {
  name: string;
  label?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "textarea"
    | "select"
    | "multiselect"
    | "radio"
    | "checkbox"
    | "switch"
    | "date";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: unknown;
  colSpan?: number;
  hidden?: (values: Record<string, unknown>) => boolean;
  disabled?: (values: Record<string, unknown>) => boolean;
  validate?: (
    value: unknown,
    all: Record<string, unknown>,
  ) => string | undefined;
  description?: string;
}

export interface MiniFormProps {
  fields: FieldDef[];
  submitLabel?: string;
  onSubmit?: (values: Record<string, unknown>) => void;
  columns?: number;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  wrap: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: "14px",
    color: "var(--vp-c-text-1, #213547)",
  } as React.CSSProperties,
  grid: (cols: number) =>
    ({
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "14px",
    }) as React.CSSProperties,
  field: (span: number, cols: number) =>
    ({
      gridColumn: `span ${Math.min(span, cols)}`,
    }) as React.CSSProperties,
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "5px",
    color: "var(--vp-c-text-1, #213547)",
  } as React.CSSProperties,
  input: (err?: string, disabled?: boolean) =>
    ({
      width: "100%",
      padding: "8px 12px",
      border: `1px solid ${err ? "#ef4444" : "var(--vp-c-divider, #c2c2c4)"}`,
      borderRadius: "8px",
      background: "var(--vp-c-bg, #fff)",
      color: "var(--vp-c-text-1, #213547)",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box" as const,
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "text",
      transition: "border-color .15s",
    }) as React.CSSProperties,
  textarea: (err?: string) =>
    ({
      width: "100%",
      padding: "8px 12px",
      border: `1px solid ${err ? "#ef4444" : "var(--vp-c-divider, #c2c2c4)"}`,
      borderRadius: "8px",
      background: "var(--vp-c-bg, #fff)",
      color: "var(--vp-c-text-1, #213547)",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box" as const,
      resize: "vertical" as const,
      minHeight: "80px",
    }) as React.CSSProperties,
  select: (err?: string) =>
    ({
      width: "100%",
      padding: "8px 12px",
      border: `1px solid ${err ? "#ef4444" : "var(--vp-c-divider, #c2c2c4)"}`,
      borderRadius: "8px",
      background: "var(--vp-c-bg, #fff)",
      color: "var(--vp-c-text-1, #213547)",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box" as const,
      cursor: "pointer",
    }) as React.CSSProperties,
  error: {
    color: "#ef4444",
    fontSize: "12px",
    marginTop: "4px",
  } as React.CSSProperties,
  desc: {
    color: "var(--vp-c-text-2, #6b7280)",
    fontSize: "12px",
    marginTop: "4px",
  } as React.CSSProperties,
  radioRow: { display: "flex", gap: "16px", flexWrap: "wrap" as const },
  radioItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  checkRow: { display: "flex", alignItems: "center", gap: "8px" },
  switchWrap: { display: "flex", alignItems: "center", gap: "10px" },
  switchTrack: (on: boolean) =>
    ({
      width: "40px",
      height: "22px",
      borderRadius: "11px",
      background: on ? "#8b5cf6" : "var(--vp-c-divider, #c2c2c4)",
      position: "relative" as const,
      cursor: "pointer",
      transition: "background .2s",
      flexShrink: 0,
    }) as React.CSSProperties,
  switchThumb: (on: boolean) =>
    ({
      position: "absolute" as const,
      top: "3px",
      left: on ? "21px" : "3px",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "#fff",
      transition: "left .2s",
      boxShadow: "0 1px 3px rgba(0,0,0,.2)",
    }) as React.CSSProperties,
  btn: {
    marginTop: "18px",
    padding: "9px 22px",
    background: "#8b5cf6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background .15s",
  } as React.CSSProperties,
  result: {
    marginTop: "16px",
    padding: "14px",
    background: "var(--vp-c-bg-soft, #f6f6f7)",
    border: "1px solid var(--vp-c-divider, #e2e2e3)",
    borderRadius: "10px",
    fontSize: "13px",
  } as React.CSSProperties,
  resultTitle: {
    fontWeight: 600,
    color: "#8b5cf6",
    marginBottom: "8px",
    fontSize: "12px",
  },
  pre: {
    margin: 0,
    whiteSpace: "pre-wrap" as const,
    color: "var(--vp-c-text-1, #213547)",
  },
  req: { color: "#ef4444", marginLeft: "2px" },
};

// ── Individual field renderer ─────────────────────────────────────────────────
function Field({
  def,
  value,
  onChange,
  onBlur,
  error,
  values,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  error?: string;
  values: Record<string, unknown>;
}) {
  const disabled = def.disabled?.(values) ?? false;
  const str = (value as string) ?? "";

  switch (def.type) {
    case "textarea":
      return (
        <>
          <textarea
            value={str}
            placeholder={def.placeholder}
            disabled={disabled}
            style={s.textarea(error)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={3}
          />
          {error && <div style={s.error}>{error}</div>}
          {def.description && <div style={s.desc}>{def.description}</div>}
        </>
      );

    case "select":
      return (
        <>
          <select
            value={str}
            disabled={disabled}
            style={s.select(error)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          >
            <option value="">— select —</option>
            {def.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {error && <div style={s.error}>{error}</div>}
          {def.description && <div style={s.desc}>{def.description}</div>}
        </>
      );

    case "multiselect":
      return (
        <>
          <select
            multiple
            value={(value as string[]) ?? []}
            disabled={disabled}
            style={{ ...s.select(error), height: "100px" }}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (o) => o.value,
              );
              onChange(selected);
            }}
            onBlur={onBlur}
          >
            {def.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {error && <div style={s.error}>{error}</div>}
          <div style={s.desc}>Hold Ctrl/Cmd to select multiple</div>
        </>
      );

    case "radio":
      return (
        <>
          <div style={s.radioRow}>
            {def.options?.map((o) => (
              <label key={o.value} style={s.radioItem}>
                <input
                  type="radio"
                  name={def.name}
                  value={o.value}
                  checked={value === o.value}
                  onChange={() => onChange(o.value)}
                  onBlur={onBlur}
                  disabled={disabled}
                  style={{ accentColor: "#8b5cf6" }}
                />
                {o.label}
              </label>
            ))}
          </div>
          {error && <div style={s.error}>{error}</div>}
        </>
      );

    case "checkbox":
      return (
        <div style={s.checkRow}>
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            disabled={disabled}
            style={{ accentColor: "#8b5cf6", width: "16px", height: "16px" }}
          />
          {error && (
            <span style={{ ...s.error, marginTop: 0, marginLeft: "8px" }}>
              {error}
            </span>
          )}
        </div>
      );

    case "switch":
      return (
        <div style={s.switchWrap}>
          <div
            style={s.switchTrack(!!value)}
            onClick={() => !disabled && onChange(!value)}
          >
            <div style={s.switchThumb(!!value)} />
          </div>
          <span
            style={{ fontSize: "13px", color: "var(--vp-c-text-2, #6b7280)" }}
          >
            {value ? "Enabled" : "Disabled"}
          </span>
        </div>
      );

    default:
      return (
        <>
          <input
            type={def.type}
            value={str}
            placeholder={def.placeholder}
            disabled={disabled}
            style={s.input(error, disabled)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
          {error && <div style={s.error}>{error}</div>}
          {def.description && <div style={s.desc}>{def.description}</div>}
        </>
      );
  }
}

// ── Mini Form Engine ──────────────────────────────────────────────────────────
export function MiniForm({
  fields,
  submitLabel = "Submit",
  onSubmit,
  columns = 12,
}: MiniFormProps) {
  const init: Record<string, unknown> = {};
  fields.forEach((f) => {
    init[f.name] = f.defaultValue ?? "";
  });

  const [values, setValues] = useState<Record<string, unknown>>(init);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(
    null,
  );

  const setField = useCallback((name: string, val: unknown) => {
    setValues((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const touchField = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.hidden?.(values)) return;
      const v = values[f.name];
      const isEmpty =
        v === "" ||
        v === null ||
        v === undefined ||
        (Array.isArray(v) && v.length === 0);
      if (f.required && isEmpty) {
        errs[f.name] = `${f.label ?? f.name} is required`;
        return;
      }
      const custom = f.validate?.(v, values);
      if (custom) errs[f.name] = custom;
    });
    setErrors(errs);
    // Mark all as touched
    const t: Record<string, boolean> = {};
    fields.forEach((f) => {
      t[f.name] = true;
    });
    setTouched(t);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Build output with only visible fields
    const out: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (!f.hidden?.(values)) out[f.name] = values[f.name];
    });
    setSubmitted(out);
    onSubmit?.(out);
  };

  return (
    <div style={s.wrap}>
      <form onSubmit={handleSubmit} noValidate>
        <div style={s.grid(columns)}>
          {fields.map((f) => {
            if (f.hidden?.(values)) return null;
            const span = f.colSpan ?? 6;
            return (
              <div key={f.name} style={s.field(span, columns)}>
                {f.type !== "checkbox" && f.type !== "switch" && (
                  <label style={s.label}>
                    {f.label ?? f.name}
                    {f.required && <span style={s.req}>*</span>}
                  </label>
                )}
                {f.type === "checkbox" || f.type === "switch" ? (
                  <label
                    style={{
                      ...s.label,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Field
                      def={f}
                      value={values[f.name]}
                      onChange={(v) => setField(f.name, v)}
                      onBlur={() => touchField(f.name)}
                      error={touched[f.name] ? errors[f.name] : undefined}
                      values={values}
                    />
                    {f.label ?? f.name}
                    {f.required && <span style={s.req}>*</span>}
                  </label>
                ) : (
                  <Field
                    def={f}
                    value={values[f.name]}
                    onChange={(v) => setField(f.name, v)}
                    onBlur={() => touchField(f.name)}
                    error={touched[f.name] ? errors[f.name] : undefined}
                    values={values}
                  />
                )}
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          style={s.btn}
          onMouseOver={(e) => (e.currentTarget.style.background = "#7c3aed")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#8b5cf6")}
        >
          {submitLabel}
        </button>
      </form>

      {submitted && (
        <div style={s.result}>
          <div style={s.resultTitle}>✅ SUBMITTED VALUES</div>
          <pre style={s.pre}>{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
