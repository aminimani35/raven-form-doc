# RavenForm

`RavenForm` is the primary entry point for rendering a Raven Form schema as a single-page form.

## Import

```ts
import { RavenForm } from "raven-form";
```

## Props

```ts
interface RavenFormProps {
  schema: FormSchema;
  /** Optional — falls back to the formAdapter registered in <RavenFormProvider>. */
  adapter?: FormAdapter;
  /** Optional — falls back to the uiAdapter registered in <RavenFormProvider>. */
  ui?: UIAdapter;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  showStateInspector?: boolean;
  className?: string;
  submitClassName?: string;
}
```

| Prop                 | Type                                | Default      | Description                                                                                       |
| -------------------- | ----------------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `schema`             | `FormSchema`                        | —            | The form schema containing field definitions                                                      |
| `adapter`            | `FormAdapter`                       | _(provider)_ | Form-state library adapter (e.g. `RHFAdapter`). Inherits from `<RavenFormProvider>` when omitted. |
| `ui`                 | `UIAdapter`                         | _(provider)_ | UI component library adapter. Inherits from `<RavenFormProvider>` when omitted.                   |
| `onSubmit`           | `(values) => void \| Promise<void>` | —            | Called with all field values when the form is submitted                                           |
| `defaultValues`      | `Record<string, unknown>`           | `{}`         | Runtime default values (merged with schema `defaultValue` props)                                  |
| `submitLabel`        | `string`                            | `"Submit"`   | Text shown on the submit button                                                                   |
| `resetLabel`         | `string`                            | `"Reset"`    | Text shown on the optional reset button                                                           |
| `showReset`          | `boolean`                           | `false`      | Render a reset button alongside the submit button                                                 |
| `showStateInspector` | `boolean`                           | `false`      | Renders a debug panel with live JSON form state                                                   |
| `className`          | `string`                            | —            | Extra CSS class added to the form root element                                                    |
| `submitClassName`    | `string`                            | —            | Extra CSS class added to the submit button                                                        |

## Example

```tsx
// With explicit adapters per form:
<RavenForm
  schema={mySchema}
  adapter={RHFAdapter}
  ui={ShadCNUIAdapter}
  onSubmit={async (values) => {
    await api.post("/users", values);
  }}
  submitLabel="Create User"
  showReset
  resetLabel="Clear"
  showStateInspector={process.env.NODE_ENV === "development"}
/>

// Or with a <RavenFormProvider> at the app root — no adapter/ui needed per form:
<RavenForm
  schema={mySchema}
  onSubmit={async (values) => {
    await api.post("/users", values);
  }}
  submitLabel="Create User"
/>
```

## Layout

`RavenForm` renders fields into a **12-column CSS grid**. Each field occupies columns according to its `colSpan` property (default: 6, i.e. half-width).

The grid columns and gap can be configured at the schema level:

```ts
const schema: FormSchema = {
  columns: 12,   // default
  gap: 'gap-4',  // Tailwind gap class
  fields: [...],
}
```

## Conditional fields

Fields with `hidden` or `disabled` as functions are automatically re-evaluated whenever any field they `dependsOn` changes. Hidden fields are unmounted from the DOM.

## State inspector

When `showStateInspector={true}`, a panel appears below the form showing the current form values in real-time. Useful during development to debug your schema.

## Internal architecture

```
RavenForm
  └── adapter.Provider           (wraps children in form-state context)
        └── for each field:
              RavenField          (reads binding, applies mask/formatter/parser)
                └── ui.FormItem  (optional label + error wrapper)
                      └── ui.components[field.type]   (resolved via UIAdapter registry)
```
