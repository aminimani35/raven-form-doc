# Custom Fields

When none of the 25+ built-in field types fits your needs, use `type: "custom"` to take full control over rendering. You receive a `FieldRenderContext` and can return any React node.

## Basic usage

```ts
import { MySpecialWidget } from '@/components/MySpecialWidget'

const schema = {
  fields: [
    {
      name: 'location',
      type: 'custom',
      label: 'Location',
      colSpan: 12,
      render: ({ value, onChange, onBlur, error, disabled }) => (
        <MySpecialWidget
          value={value as { lat: number; lng: number } | null}
          onChange={onChange}
          onBlur={onBlur}
          hasError={!!error}
          errorMessage={error}
          disabled={disabled}
        />
      ),
    },
  ],
}
```

---

## `FieldRenderContext`

The `render` callback receives a rich context object:

```ts
interface FieldRenderContext {
  /** The field's `name` */
  name: string;

  /** Current display value (after parser has been applied) */
  value: unknown;

  /** Call this to update the field value */
  onChange: (value: unknown) => void;

  /** Call this when the field loses focus */
  onBlur: () => void;

  /** Validation error message, if any */
  error?: string;

  /** Whether the field is disabled */
  disabled?: boolean;

  /** The field's label */
  label?: string;

  /** The field's placeholder */
  placeholder?: string;
}
```

---

## Validation still works

Custom fields participate fully in validation. Just define `validation` as usual:

```ts
{
  name: 'signature',
  type: 'custom',
  label: 'Signature',
  validation: { required: 'Please sign before continuing' },
  render: ({ value, onChange, error }) => (
    <SignaturePad
      data={value as string | null}
      onChange={onChange}
      invalid={!!error}
    />
  ),
}
```

---

## Masking & formatting still works

The `handleChange` exposed via `FieldRenderContext.onChange` goes through the same mask → formatter pipeline as built-in fields. So you can still use `mask`, `formatter`, and `parser` on custom fields:

```ts
{
  name: 'amount',
  type: 'custom',
  mask: 'currency',
  parser: 'currency',
  render: ({ value, onChange }) => (
    <CurrencyInput value={value} onValueChange={onChange} />
  ),
}
```

---

## Wrapping with FormItem

Custom fields skip the `FormItem` wrapper by default at the field level. If you want to render a label, description, and error message, wrap your render output with `ui.FormItem` yourself — or simply rely on your component's own label/error display.

---

## Full example — Color Palette Picker

```tsx
const PALETTES = [
  { label: "Ocean", colors: ["#0ea5e9", "#38bdf8", "#bae6fd"] },
  { label: "Emerald", colors: ["#10b981", "#34d399", "#a7f3d0"] },
  { label: "Rose", colors: ["#f43f5e", "#fb7185", "#fecdd3"] },
];

const schema = {
  fields: [
    {
      name: "palette",
      type: "custom",
      label: "Color Palette",
      colSpan: 12,
      validation: { required: "Please select a palette" },
      render: ({ value, onChange, error }) => (
        <div>
          <div style={{ display: "flex", gap: 12 }}>
            {PALETTES.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.label)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border:
                    value === p.label
                      ? "2px solid #10b981"
                      : "2px solid transparent",
                  background: p.colors[0],
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          {error && (
            <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>{error}</p>
          )}
        </div>
      ),
    },
  ],
};
```
