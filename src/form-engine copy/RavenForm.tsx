"use client";

import { memo, useMemo, useState } from "react";
import type { RavenFormProps, FormField, FieldRenderContext } from "./types";
import { useRavenField } from "./hooks/useRavenField";
import { RavenRepeaterField } from "./RavenRepeaterField";
import { cn } from "./utils/cn";
import { Button, Spinner } from "./components/Button";
import {
  useFormAdapterOrProp,
  useUIAdapterOrProp,
  useFormAdapter,
  UIAdapterContext,
  FormAdapterContext,
} from "./providers";
import { resolveFieldComponent, buildFieldProps, isInlineType } from "./renderer";

// ─── State Inspector (dev-only) ────────────────────────────────────────────
const StateInspector = memo(() => {
  const adapter = useFormAdapter()!;
  const values = adapter.useWatch();
  return (
    <div style={{ marginTop: 16, padding: 12, border: "1px solid #e2e8f0", borderRadius: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
        🐛 Form State Inspector
      </p>
      <pre style={{ fontSize: 11, overflow: "auto", maxHeight: 160, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
});
StateInspector.displayName = "StateInspector";

// ─── Individual Field ───────────────────────────────────────────────────────────────
interface RavenFieldProps {
  field: FormField;
  watchedValues: Record<string, unknown>;
}

const RavenField = memo<RavenFieldProps>(({ field, watchedValues }) => {
  const adapter = useFormAdapter()!;
  const ui = useUIAdapterOrProp();

  const rawBinding = adapter.useField(field.name);
  const { handleChange, displayValue, error, onBlur, isValidating } =
    useRavenField({ field, binding: rawBinding });

  const isDisabled = useMemo(
    () =>
      typeof field.disabled === "function"
        ? field.disabled(watchedValues)
        : (field.disabled ?? false),
    [field.disabled, watchedValues],
  );

  const isHidden = useMemo(
    () =>
      typeof field.hidden === "function"
        ? field.hidden(watchedValues)
        : (field.hidden ?? false),
    [field.hidden, watchedValues],
  );

  if (isHidden) return null;

  // Repeater — delegated to RavenRepeaterField
  if (field.type === "repeater") {
    return <RavenRepeaterField field={field} />;
  }

  const colClass = field.colSpan
    ? `col-span-12 sm:col-span-${field.colSpan}`
    : "col-span-12 sm:col-span-6";

  const isRequired = !!field.validation?.required;

  // Custom render escape hatch — bypasses adapter registry entirely
  if (field.type === "custom" && field.render) {
    const ctx: FieldRenderContext = {
      name: field.name,
      value: displayValue,
      onChange: handleChange,
      onBlur,
      error,
      disabled: isDisabled,
      label: field.label,
      placeholder: field.placeholder,
    };
    return <div className={colClass}>{field.render(ctx)}</div>;
  }

  // Resolve component from UIAdapter registry (headless — no switch/case)
  const FieldComponent = resolveFieldComponent(field.type, ui);
  if (!FieldComponent) return null;

  const fieldProps = buildFieldProps(field, {
    value: displayValue,
    onChange: handleChange,
    onBlur,
    error,
    disabled: isDisabled,
  });

  // Inline types (checkbox, switch, etc.) skip FormItem wrapping
  if (isInlineType(field.type, ui)) {
    return (
      <div className={cn(colClass, "flex items-center pt-6")}>
        <FieldComponent {...fieldProps} />
        {isValidating && (
          <Spinner className="w-3.5 h-3.5 text-muted-foreground ms-2" />
        )}
      </div>
    );
  }

  // FormItem wrapper (label + error + description chrome)
  if (ui.FormItem) {
    const { FormItem } = ui;
    return (
      <div className={colClass}>
        <FormItem
          label={field.label}
          error={error}
          description={field.description}
          required={isRequired}
        >
          <div style={{ position: "relative" }}>
            <FieldComponent {...fieldProps} />
            {isValidating && (
              <Spinner className="w-3.5 h-3.5 absolute top-1/2 end-3 -translate-y-1/2 text-muted-foreground" />
            )}
          </div>
        </FormItem>
      </div>
    );
  }

  // Bare render — no FormItem registered in this adapter
  return (
    <div className={colClass} style={{ position: "relative" }}>
      <FieldComponent {...fieldProps} />
      {isValidating && (
        <Spinner className="w-3.5 h-3.5 absolute top-1/2 end-3 -translate-y-1/2 text-muted-foreground" />
      )}
    </div>
  );
});
RavenField.displayName = "RavenField";

// ─── Submit Button ─────────────────────────────────────────────────────────────────────
const RavenSubmitButton = memo(
  ({
    submitLabel,
    resetLabel,
    showReset,
    submitClassName,
  }: {
    submitLabel: string;
    resetLabel?: string;
    showReset?: boolean;
    submitClassName?: string;
  }) => {
    const [loading] = useState(false);
    return (
      <div className="col-span-12 flex items-center gap-3 pt-2">
        <Button
          type="submit"
          loading={loading}
          className={cn("min-w-[120px]", submitClassName)}
          disabled={loading}
        >
          {submitLabel}
        </Button>
        {showReset && (
          <Button type="reset" variant="outline">
            {resetLabel ?? "پاک کردن"}
          </Button>
        )}
      </div>
    );
  },
);
RavenSubmitButton.displayName = "RavenSubmitButton";

// ─── Form Inner (lives inside Provider so adapter hooks work) ────────────────────────
type RavenFormInnerProps = Omit<RavenFormProps, "onSubmit" | "defaultValues" | "adapter" | "ui">;

const RavenFormInner = memo<RavenFormInnerProps>(
  ({ schema, submitLabel, resetLabel, showReset, showStateInspector, className, submitClassName }) => {
    const adapter = useFormAdapter()!;

    const dependentNames = useMemo(
      () => [...new Set(schema.fields.filter((f) => f.dependsOn).flatMap((f) => f.dependsOn!))],
      [schema.fields],
    );

    const watchedValues = adapter.useWatch(
      dependentNames.length > 0 ? dependentNames : undefined,
    );

    const cols = schema.columns ?? 12;
    const gap = schema.gap ?? "gap-4";

    return (
      <>
        <div
          className={cn(`grid gap-x-4 ${gap}`, className)}
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          data-raven-form
        >
          {schema.fields.map((field) => (
            <RavenField key={field.name} field={field} watchedValues={watchedValues} />
          ))}
          <RavenSubmitButton
            submitLabel={submitLabel ?? "ذخیره"}
            resetLabel={resetLabel}
            showReset={showReset}
            submitClassName={submitClassName}
          />
        </div>
        {showStateInspector && <StateInspector />}
      </>
    );
  },
);
RavenFormInner.displayName = "RavenFormInner";

// ─── RavenForm ───────────────────────────────────────────────────────────────────────────────
export const RavenForm = memo<RavenFormProps>((props) => {
  const { schema, onSubmit, defaultValues, ...rest } = props;

  // Resolve adapters — prop override takes priority over RavenFormProvider context
  const adapter = useFormAdapterOrProp(props.adapter);
  const ui = useUIAdapterOrProp(props.ui);

  // Merge schema-level defaults + user-supplied defaults here in core.
  // This keeps FormAdapter.Provider schema-agnostic.
  const mergedDefaults = useMemo(() => {
    const schemaDefaults: Record<string, unknown> = {};
    schema.fields.forEach((f) => {
      if (f.defaultValue !== undefined) schemaDefaults[f.name] = f.defaultValue;
    });
    return { ...schemaDefaults, ...defaultValues };
  }, [schema.fields, defaultValues]);

  // Re-provide resolved adapters so all descendants read them via hooks.
  return (
    <UIAdapterContext.Provider value={ui}>
      <FormAdapterContext.Provider value={adapter}>
        <adapter.Provider onSubmit={onSubmit} defaultValues={mergedDefaults}>
          <RavenFormInner schema={schema} {...rest} />
        </adapter.Provider>
      </FormAdapterContext.Provider>
    </UIAdapterContext.Provider>
  );
});
RavenForm.displayName = "RavenForm";

export default RavenForm;
