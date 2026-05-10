# UI Adapters

A **UI Adapter** decouples Raven Form's rendering engine from any specific component library. It maps field types to your own React components through a simple `components` registry.

---

## `UIAdapter` interface

```ts
interface UIAdapter {
  /**
   * Component registry keyed by FieldType (or any custom string type).
   * Resolution order:
   *  1. components[field.type]   — exact match
   *  2. components["text"]       — text-family fallback (email/tel/url/number/password/time/datetime)
   *  3. fallback                  — catch-all component
   *  4. null + dev warning       — unregistered type
   */
  components: Partial<Record<FieldType | string, ComponentType<UIFieldProps>>>;

  /** Optional wrapper rendered around each non-inline field (label + error chrome). */
  FormItem?: ComponentType<UIFormItemProps>;

  /**
   * Field types that skip the FormItem wrapper and render inline.
   * Defaults to `["checkbox", "switch"]`.
   */
  inlineTypes?: Array<FieldType | string>;

  /** Catch-all component when a field type has no registered component. */
  fallback?: ComponentType<UIFieldProps>;
}
```

---

## `UIFieldProps`

Every component in the `components` registry receives a single, unified props object:

```ts
interface UIFieldProps {
  id?: string;
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  /**
   * Auto-injected HTML input type for text-family fields:
   * "email" | "tel" | "url" | "number" | "password" | "time" | "datetime-local"
   */
  type?: string;
  /** For selection fields: select, multiselect, radio */
  options?: Array<{ label: string; value: unknown; disabled?: boolean }>;
  /** Extra props forwarded from field.componentProps */
  [key: string]: unknown;
}
```

---

## `UIFormItemProps`

```ts
interface UIFormItemProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}
```

---

## Resolution order

When the engine renders a field it looks for a component in this order:

| Priority | Check | Example |
|---|---|---|
| 1 | `components[field.type]` | `components.email` |
| 2 | `components["text"]` | automatic fallback for email/tel/url/… |
| 3 | `adapter.fallback` | catch-all for unknown types |
| 4 | `null` | dev console warning, field skipped |

This means a single `text` component handles all text-family inputs unless you register a more specific one.

---

## Built-in UI adapters

### `ShadCNUIAdapter`

Built on [ShadCN/ui](https://ui.shadcn.com/) (Tailwind CSS).

```tsx
import { ShadCNUIAdapter } from 'raven-form/ui/shadcn'

<RavenForm ui={ShadCNUIAdapter} ... />
```

### `AntDUIAdapter`

Built on [Ant Design](https://ant.design/).

```tsx
import { AntDUIAdapter } from 'raven-form/ui/antd'

<RavenForm ui={AntDUIAdapter} ... />
```

---

## Building a custom UI adapter

The complete step-by-step guide — covering all 13 field types (text, textarea, select, multiselect, radio, checkbox, switch, date, file, range, color, rating, otp), the `FormItem` wrapper, the `fallback` component, `createUIAdapter`, global registration, and `componentProps` forwarding — lives in its own dedicated page:

👉 **[Custom UI Adapter →](/guide/custom-ui-adapter)**

---

## Using at provider level

Register a default UI adapter globally so every `<RavenForm>` inside inherits it:

```tsx
import { RavenFormProvider } from 'raven-form'
import { MyUIAdapter } from './adapters/MyUIAdapter'
import { RHFAdapter }  from 'raven-form/adapters/rhf'

function App() {
  return (
    <RavenFormProvider uiAdapter={MyUIAdapter} formAdapter={RHFAdapter}>
      <MyApp />
    </RavenFormProvider>
  )
}
```

Override per-form by passing the `ui` prop directly:

```tsx
<RavenForm ui={AltUIAdapter} schema={schema} onSubmit={handleSubmit} />
```

---

## Passing extra props to components

Forward arbitrary props to any UI component via `componentProps` in the field schema:

```ts
{
  name: 'description',
  type: 'textarea',
  label: 'Description',
  componentProps: {
    rows: 6,
    autoResize: true,
  },
}
```

These are spread onto the component via the index signature on `UIFieldProps`.
