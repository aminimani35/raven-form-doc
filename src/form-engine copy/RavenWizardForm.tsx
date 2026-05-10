"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import { cn } from "./utils/cn";
import { Button, Spinner } from "./components/Button";
import type {
  RavenWizardFormProps,
  WizardStep,
  FormField,
  FieldRenderContext,
} from "./types";
import { useRavenField } from "./hooks/useRavenField";
import { RavenRepeaterField } from "./RavenRepeaterField";
import {
  useFormAdapterOrProp,
  useUIAdapterOrProp,
  useFormAdapter,
  UIAdapterContext,
  FormAdapterContext,
} from "./providers";
import {
  resolveFieldComponent,
  buildFieldProps,
  isInlineType,
} from "./renderer";

// ─── State Inspector ────────────────────────────────────────────────────
const StateInspector = memo(() => {
  const adapter = useFormAdapter()!;
  const values = adapter.useWatch();
  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
        🐛 Form State Inspector
      </p>
      <pre
        style={{
          fontSize: 11,
          overflow: "auto",
          maxHeight: 160,
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
});
StateInspector.displayName = "StateInspector";

// ─── Step Progress Bar ───────────────────────────────────────────────────
const StepBar = memo(
  ({
    steps,
    current,
    completed,
  }: {
    steps: WizardStep[];
    current: number;
    completed: Set<number>;
  }) => (
    <div className="flex items-start gap-0 w-full mb-6 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const isDone = completed.has(i);
        const isCurrent = i === current;
        const isUpcoming = i > current && !completed.has(i);
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1 min-w-[4rem]">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200 shrink-0",
                  isDone && "bg-emerald-500 border-emerald-500 text-white",
                  isCurrent &&
                    "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                  isUpcoming && "bg-muted border-border text-muted-foreground",
                )}
              >
                {isDone ? (
                  <span>✓</span>
                ) : step.icon ? (
                  <span>{step.icon}</span>
                ) : (
                  i + 1
                )}
              </div>
              <p
                className={cn(
                  "text-[10px] font-medium text-center mt-1.5 leading-tight max-w-[4.5rem]",
                  isCurrent ? "text-primary" : "text-muted-foreground",
                  isDone && "text-emerald-600",
                )}
              >
                {step.title}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 flex items-start pt-[18px]">
                <div
                  className={cn(
                    "h-0.5 w-full transition-colors duration-300",
                    completed.has(i) ? "bg-emerald-500" : "bg-border",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  ),
);
StepBar.displayName = "StepBar";

// ─── Wizard Field ────────────────────────────────────────────────────────────────────────
interface WizardRavenFieldProps {
  field: FormField;
  watchedValues: Record<string, unknown>;
}

const WizardRavenField = memo<WizardRavenFieldProps>(
  ({ field, watchedValues }) => {
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

    if (field.type === "repeater") {
      return <RavenRepeaterField field={field} />;
    }

    const colClass = field.colSpan
      ? `col-span-12 sm:col-span-${field.colSpan}`
      : "col-span-12 sm:col-span-6";

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

    const FieldComponent = resolveFieldComponent(field.type, ui);
    if (!FieldComponent) return null;

    const fieldProps = buildFieldProps(field, {
      value: displayValue,
      onChange: handleChange,
      onBlur,
      error,
      disabled: isDisabled,
    });

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

    if (ui.FormItem) {
      const { FormItem } = ui;
      return (
        <div className={colClass}>
          <FormItem
            label={field.label}
            error={error}
            description={field.description}
            required={!!field.validation?.required}
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

    return (
      <div className={colClass} style={{ position: "relative" }}>
        <FieldComponent {...fieldProps} />
        {isValidating && (
          <Spinner className="w-3.5 h-3.5 absolute top-1/2 end-3 -translate-y-1/2 text-muted-foreground" />
        )}
      </div>
    );
  },
);
WizardRavenField.displayName = "WizardRavenField";

// ─── Wizard Inner ───────────────────────────────────────────────────────────────────────
const WizardInner = memo(
  ({
    steps,
    submitLabel,
    showStateInspector,
    className,
  }: Omit<
    RavenWizardFormProps,
    "onSubmit" | "defaultValues" | "adapter" | "ui"
  >) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState<Set<number>>(new Set());
    const [validating, setValidating] = useState(false);
    const adapter = useFormAdapter()!;

    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;

    const dependentNames = useMemo(() => {
      const names = step.fields
        .filter((f) => f.dependsOn)
        .flatMap((f) => f.dependsOn!);
      return [...new Set(names)];
    }, [step.fields]);

    const watchedValues = adapter.useWatch(
      dependentNames.length > 0 ? dependentNames : undefined,
    );
    const triggerFn = adapter.useTrigger?.();

    const goNext = useCallback(async () => {
      setValidating(true);
      let valid = true;
      if (triggerFn) {
        const fieldNames = step.fields
          .filter((f) => f.type !== "custom" && f.type !== "repeater")
          .map((f) => f.name);
        valid = await triggerFn(fieldNames);
      }
      setValidating(false);
      if (valid) {
        setCompleted((prev) => new Set([...prev, currentStep]));
        setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
      }
    }, [currentStep, step.fields, steps.length, triggerFn]);

    const goBack = useCallback(() => {
      setCurrentStep((s) => Math.max(s - 1, 0));
    }, []);

    const cols = step.columns ?? 12;

    return (
      <div className={cn("flex flex-col gap-0", className)}>
        <StepBar steps={steps} current={currentStep} completed={completed} />

        <div className="mb-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            {step.icon && (
              <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">{step.icon}</span>
              </span>
            )}
            {step.title}
          </h3>
          {step.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {step.description}
            </p>
          )}
        </div>

        <div
          className="grid gap-x-4 gap-y-4"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {step.fields.map((field) => (
            <WizardRavenField
              key={field.name}
              field={field}
              watchedValues={watchedValues}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0}
            className="gap-1.5"
          >
            → قبلی
          </Button>
          <span className="text-xs text-muted-foreground">
            گام {currentStep + 1} از {steps.length}
          </span>
          {isLast ? (
            <Button type="submit" className="gap-1.5" loading={validating}>
              ✓ {submitLabel ?? "ارسال"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              loading={validating}
              className="gap-1.5"
            >
              بعدی ←
            </Button>
          )}
        </div>

        {showStateInspector && <StateInspector />}
      </div>
    );
  },
);
WizardInner.displayName = "WizardInner";

// ─── RavenWizardForm ───────────────────────────────────────────────────────────────────
export const RavenWizardForm = memo<RavenWizardFormProps>((props) => {
  const { steps, onSubmit, defaultValues, ...rest } = props;

  const adapter = useFormAdapterOrProp(props.adapter);
  const ui = useUIAdapterOrProp(props.ui);

  // Merge all step field defaults + user defaults in core
  const mergedDefaults = useMemo(() => {
    const schemaDefaults: Record<string, unknown> = {};
    steps
      .flatMap((s) => s.fields)
      .forEach((f) => {
        if (f.defaultValue !== undefined)
          schemaDefaults[f.name] = f.defaultValue;
      });
    return { ...schemaDefaults, ...defaultValues };
  }, [steps, defaultValues]);

  return (
    <UIAdapterContext.Provider value={ui}>
      <FormAdapterContext.Provider value={adapter}>
        <adapter.Provider onSubmit={onSubmit} defaultValues={mergedDefaults}>
          <WizardInner steps={steps} {...rest} />
        </adapter.Provider>
      </FormAdapterContext.Provider>
    </UIAdapterContext.Provider>
  );
});
RavenWizardForm.displayName = "RavenWizardForm";

export default RavenWizardForm;
