/**
 * demoAdapter.tsx
 *
 * A self-contained FormAdapter + UIAdapter that uses the REAL Raven Form engine
 * contracts. The FormAdapter is backed by plain React `useState` so docs demos
 * have zero third-party form-library dependencies.
 *
 * The UIAdapter uses inline styles that inherit VitePress CSS variables so it
 * looks correct in both light and dark mode.
 */

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";

// ── Import from the real engine ────────────────────────────────────────────────
import {
  createFormAdapter,
  createUIAdapter,
} from "../../src/form-engine copy/index";
import type {
  UIFieldProps,
  UIFormItemProps,
  FormAdapterProviderProps,
} from "../../src/form-engine copy/index";

// ══════════════════════════════════════════════════════════════════════════════
// ── FormAdapter: useState-backed, zero external deps ─────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

interface FormCtxValue {
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string | undefined) => void;
  getSubmit: () => () => void;
  registerSubmit: (fn: () => void) => void;
}

const FormCtx = createContext<FormCtxValue | null>(null);

const useFormCtx = (): FormCtxValue => {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error("[demoAdapter] useFormCtx used outside Provider");
  return ctx;
};

function DemoProvider({ children, defaultValues = {}, onSubmit }: FormAdapterProviderProps) {
  const [values, setValues] = useState<Record<string, unknown>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const submitRef = useRef<() => void>(() => onSubmit(values));

  const valuesRef = useRef(values);
  valuesRef.current = values;

  const setValue = (name: string, value: unknown) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      valuesRef.current = next;
      return next;
    });
    // clear error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const setError = (name: string, error: string | undefined) =>
    setErrors((prev) => ({ ...prev, [name]: error }));

  const registerSubmit = (fn: () => void) => {
    submitRef.current = fn;
  };

  const getSubmit = () => submitRef.current;

  // The actual submit logic lives in the Provider since it owns values + onSubmit
  submitRef.current = () => onSubmit(valuesRef.current);

  return (
    <FormCtx.Provider value={{ values, errors, setValue, setError, getSubmit, registerSubmit }}>
      {children}
    </FormCtx.Provider>
  );
}

export const demoFormAdapter = createFormAdapter({
  Provider: DemoProvider,

  useField: (name: string) => {
    const { values, errors, setValue } = useFormCtx();
    return {
      value: values[name] ?? "",
      onChange: (val: unknown) => setValue(name, val),
      onBlur: () => {},
      error: errors[name],
    };
  },

  useSubmit: () => {
    const { getSubmit } = useFormCtx();
    return getSubmit();
  },

  useWatch: (names?: string[]) => {
    const { values } = useFormCtx();
    if (!names) return values;
    return Object.fromEntries(names.map((n) => [n, values[n]]));
  },
});

// ══════════════════════════════════════════════════════════════════════════════
// ── UIAdapter: inline-styled, VitePress colour-variable aware ────────────────
// ══════════════════════════════════════════════════════════════════════════════

// ── shared tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:       "var(--vp-c-bg, #fff)",
  bgSoft:   "var(--vp-c-bg-soft, #f6f6f7)",
  text1:    "var(--vp-c-text-1, #213547)",
  text2:    "var(--vp-c-text-2, #6b7280)",
  divider:  "var(--vp-c-divider, #d1d5db)",
  brand:    "var(--vp-c-brand-1, #8b5cf6)",
  red:      "#ef4444",
  radius:   "8px",
  font:     "system-ui, -apple-system, sans-serif",
} as const;

// ── base input style ──────────────────────────────────────────────────────────
const inputStyle = (error?: string, disabled?: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "8px 12px",
  border: `1px solid ${error ? T.red : T.divider}`,
  borderRadius: T.radius,
  background: T.bg,
  color: T.text1,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? "not-allowed" : undefined,
  fontFamily: T.font,
});

// ── Text / Email / Password / Tel / Number ─────────────────────────────────────
const DemoInput = ({ value, onChange, onBlur, placeholder, disabled, type, error, name }: UIFieldProps) => (
  <input
    id={name}
    name={name}
    type={type ?? "text"}
    value={(value as string) ?? ""}
    placeholder={placeholder}
    disabled={disabled}
    aria-invalid={!!error}
    style={inputStyle(error, disabled)}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

// ── Textarea ───────────────────────────────────────────────────────────────────
const DemoTextarea = ({ value, onChange, onBlur, placeholder, disabled, error, name }: UIFieldProps) => (
  <textarea
    id={name}
    name={name}
    value={(value as string) ?? ""}
    placeholder={placeholder}
    disabled={disabled}
    aria-invalid={!!error}
    rows={3}
    style={{ ...inputStyle(error, disabled), resize: "vertical", minHeight: "80px" }}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

// ── Select ─────────────────────────────────────────────────────────────────────
const DemoSelect = ({ value, onChange, onBlur, options = [], disabled, error, name }: UIFieldProps) => (
  <select
    id={name}
    name={name}
    value={(value as string) ?? ""}
    disabled={disabled}
    aria-invalid={!!error}
    style={{ ...inputStyle(error, disabled), cursor: disabled ? "not-allowed" : "pointer" }}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  >
    <option value="">— Select —</option>
    {options.map((o) => (
      <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
        {o.label}
      </option>
    ))}
  </select>
);

// ── Multi-select ───────────────────────────────────────────────────────────────
const DemoMultiSelect = ({ value, onChange, onBlur, options = [], disabled, error, name }: UIFieldProps) => {
  const current = (value as string[]) ?? [];
  const toggle = (val: string) => {
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    onChange(next);
  };
  return (
    <div id={name} style={{ display: "flex", flexWrap: "wrap", gap: "8px" }} onBlur={onBlur}>
      {options.map((o) => {
        const selected = current.includes(String(o.value));
        return (
          <button
            key={String(o.value)}
            type="button"
            disabled={disabled || o.disabled}
            onClick={() => toggle(String(o.value))}
            style={{
              padding: "5px 12px",
              borderRadius: "999px",
              border: `1px solid ${selected ? T.brand : T.divider}`,
              background: selected ? T.brand : T.bg,
              color: selected ? "#fff" : T.text1,
              fontSize: "13px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: (disabled || o.disabled) ? 0.5 : 1,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

// ── Radio ──────────────────────────────────────────────────────────────────────
const DemoRadio = ({ value, onChange, options = [], disabled, name }: UIFieldProps) => (
  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
    {options.map((o) => (
      <label
        key={String(o.value)}
        style={{ display: "flex", alignItems: "center", gap: "6px", cursor: disabled ? "not-allowed" : "pointer", opacity: (disabled || o.disabled) ? 0.5 : 1, fontSize: "14px", color: T.text1 }}
      >
        <input
          type="radio"
          name={name}
          value={String(o.value)}
          checked={value === o.value}
          disabled={disabled || o.disabled}
          onChange={() => onChange(o.value)}
          style={{ accentColor: T.brand }}
        />
        {o.label}
      </label>
    ))}
  </div>
);

// ── Checkbox ───────────────────────────────────────────────────────────────────
const DemoCheckbox = ({ value, onChange, label, disabled, name }: UIFieldProps) => (
  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: disabled ? "not-allowed" : "pointer", fontSize: "14px", color: T.text1 }}>
    <input
      type="checkbox"
      name={name}
      checked={Boolean(value)}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      style={{ width: "16px", height: "16px", accentColor: T.brand }}
    />
    {label}
  </label>
);

// ── Switch ─────────────────────────────────────────────────────────────────────
const DemoSwitch = ({ value, onChange, label, disabled, name }: UIFieldProps) => {
  const on = Boolean(value);
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: disabled ? "not-allowed" : "pointer", fontSize: "14px", color: T.text1, opacity: disabled ? 0.5 : 1 }}>
      <input type="checkbox" name={name} checked={on} disabled={disabled} onChange={(e) => onChange(e.target.checked)} style={{ display: "none" }} />
      <span
        style={{
          width: "40px", height: "22px", borderRadius: "11px",
          background: on ? T.brand : T.divider,
          position: "relative", flexShrink: 0, transition: "background .2s",
        }}
      >
        <span style={{ position: "absolute", top: "3px", left: on ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
      </span>
      {label}
    </label>
  );
};

// ── Date/Time/Datetime ─────────────────────────────────────────────────────────
const DemoDateInput = ({ value, onChange, onBlur, disabled, error, type, name }: UIFieldProps) => (
  <input
    id={name}
    name={name}
    type={type ?? "date"}
    value={(value as string) ?? ""}
    disabled={disabled}
    aria-invalid={!!error}
    style={inputStyle(error, disabled)}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

// ── Range ──────────────────────────────────────────────────────────────────────
const DemoRange = ({ value, onChange, onBlur, disabled, name }: UIFieldProps) => (
  <input
    type="range"
    id={name}
    name={name}
    value={(value as number) ?? 0}
    disabled={disabled}
    min={0} max={100}
    style={{ width: "100%", accentColor: T.brand }}
    onChange={(e) => onChange(Number(e.target.value))}
    onBlur={onBlur}
  />
);

// ── Color ──────────────────────────────────────────────────────────────────────
const DemoColor = ({ value, onChange, onBlur, disabled, name }: UIFieldProps) => (
  <input
    type="color"
    id={name}
    name={name}
    value={(value as string) ?? "#8b5cf6"}
    disabled={disabled}
    style={{ width: "48px", height: "36px", border: "none", cursor: disabled ? "not-allowed" : "pointer", borderRadius: "6px" }}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

// ── File ───────────────────────────────────────────────────────────────────────
const DemoFile = ({ onChange, onBlur, disabled, error, name }: UIFieldProps) => (
  <input
    type="file"
    id={name}
    name={name}
    disabled={disabled}
    aria-invalid={!!error}
    style={{ fontSize: "13px", color: T.text1 }}
    onChange={(e) => onChange(e.target.files)}
    onBlur={onBlur}
  />
);

// ── Rating ─────────────────────────────────────────────────────────────────────
const DemoRating = ({ value, onChange, disabled, name }: UIFieldProps) => {
  const stars = 5;
  const current = Number(value) || 0;
  return (
    <div style={{ display: "flex", gap: "4px" }} id={name}>
      {Array.from({ length: stars }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            style={{ border: "none", background: "none", cursor: disabled ? "not-allowed" : "pointer", fontSize: "22px", lineHeight: 1, color: star <= current ? "#f59e0b" : T.divider, padding: "0 2px" }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

// ── OTP ────────────────────────────────────────────────────────────────────────
const DemoOTP = ({ value, onChange, onBlur, disabled, error, name }: UIFieldProps) => {
  const digits = 6;
  const str = (value as string) ?? "";
  const arr = str.split("").concat(Array(digits).fill("")).slice(0, digits);

  const handleKey = (i: number, val: string) => {
    const next = arr.map((d, idx) => (idx === i ? val.slice(-1) : d));
    onChange(next.join(""));
    if (val && i < digits - 1) {
      const el = document.getElementById(`${name}-otp-${i + 1}`);
      el?.focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {arr.map((d, i) => (
        <input
          key={i}
          id={`${name}-otp-${i}`}
          type="text"
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-invalid={!!error}
          style={{ ...inputStyle(error, disabled), width: "42px", textAlign: "center", padding: "8px 0", fontSize: "18px", fontWeight: 700 }}
          onChange={(e) => handleKey(i, e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d && i > 0) {
              document.getElementById(`${name}-otp-${i - 1}`)?.focus();
            }
          }}
        />
      ))}
    </div>
  );
};

// ── FormItem wrapper ───────────────────────────────────────────────────────────
const DemoFormItem = ({ label, error, description, required, children }: UIFormItemProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    {label && (
      <label style={{ fontSize: "13px", fontWeight: 500, color: T.text1 }}>
        {label}
        {required && <span style={{ color: T.red, marginLeft: "2px" }}>*</span>}
      </label>
    )}
    {children}
    {description && !error && (
      <p style={{ fontSize: "12px", color: T.text2, margin: 0 }}>{description}</p>
    )}
    {error && (
      <p style={{ fontSize: "12px", color: T.red, margin: 0 }}>{error}</p>
    )}
  </div>
);

// ── Assemble UIAdapter ─────────────────────────────────────────────────────────
export const demoUIAdapter = createUIAdapter({
  components: {
    text:        DemoInput,
    // text-family (engine auto-sets type prop)
    email:       DemoInput,
    tel:         DemoInput,
    url:         DemoInput,
    number:      DemoInput,
    password:    DemoInput,
    textarea:    DemoTextarea,
    select:      DemoSelect,
    multiselect: DemoMultiSelect,
    radio:       DemoRadio,
    checkbox:    DemoCheckbox,
    switch:      DemoSwitch,
    date:        DemoDateInput,
    time:        DemoDateInput,
    datetime:    DemoDateInput,
    range:       DemoRange,
    color:       DemoColor,
    file:        DemoFile,
    rating:      DemoRating,
    otp:         DemoOTP,
  },
  FormItem:    DemoFormItem,
  inlineTypes: ["checkbox", "switch"],
});
