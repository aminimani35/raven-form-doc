"use client";

import React, { memo, useCallback } from "react";
import { cn } from "./utils/cn";
import { Button } from "./components/Button";
import type { FormField, RepeaterConfig } from "./types";
import { useFormAdapter, useUIAdapterOrProp } from "./providers";
import { resolveFieldComponent, buildFieldProps, isInlineType } from "./renderer";

// ─── Inline RavenField (for repeater sub-fields) ─────────────────────────────────
const InlineRavenField = memo<{ field: FormField }>(({ field }) => {
  const adapter = useFormAdapter()!;
  const ui = useUIAdapterOrProp();
  const binding = adapter.useField(field.name);

  const colClass = field.colSpan
    ? `col-span-12 sm:col-span-${field.colSpan}`
    : "col-span-12 sm:col-span-6";

  const FieldComponent = resolveFieldComponent(field.type, ui);
  if (!FieldComponent) return null;

  const fieldProps = buildFieldProps(field, {
    value: (binding.value as string | number | undefined) ?? "",
    onChange: binding.onChange,
    onBlur: binding.onBlur,
    error: binding.error,
    disabled: typeof field.disabled === "boolean" ? field.disabled : false,
  });

  if (isInlineType(field.type, ui)) {
    return (
      <div className={cn(colClass, "flex items-center pt-5")}>
        <FieldComponent {...fieldProps} />
      </div>
    );
  }

  if (ui.FormItem) {
    const { FormItem } = ui;
    return (
      <div className={colClass}>
        <FormItem
          label={field.label}
          error={binding.error}
          description={field.description}
          required={!!field.validation?.required}
        >
          <FieldComponent {...fieldProps} />
        </FormItem>
      </div>
    );
  }

  return (
    <div className={colClass}>
      <FieldComponent {...fieldProps} />
    </div>
  );
});
InlineRavenField.displayName = "InlineRavenField";

// ─── Repeater Row ──────────────────────────────────────────────────────────────────────
interface RepeaterRowProps {
  rowIndex: number;
  rowId: string;
  config: RepeaterConfig;
  namePrefix: string;
  canRemove: boolean;
  onRemove: (rowId: string) => void;
}

const RepeaterRow = memo<RepeaterRowProps>(
  ({ rowIndex, rowId, config, namePrefix, canRemove, onRemove }) => (
    <div className="relative rounded-xl border border-border bg-muted/20 p-4">
      <div className="absolute -top-3 start-4 flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5">
          #{rowIndex + 1}
        </span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
        {config.fields.map((subField) => (
          <InlineRavenField
            key={subField.name}
            field={{ ...subField, name: `${namePrefix}[${rowIndex}].${subField.name}` }}
          />
        ))}
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(rowId)}
          className="absolute -top-3 end-3 w-6 h-6 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
          title={config.removeLabel ?? "حذف ردیف"}
        >
          ×
        </button>
      )}
    </div>
  ),
);
RepeaterRow.displayName = "RepeaterRow";

// ─── Row ID ──────────────────────────────────────────────────────────────────────────────────
let _nextId = 0;
const genId = () => `row_${++_nextId}`;

// ─── RavenRepeaterField ────────────────────────────────────────────────────────────────
export interface RavenRepeaterFieldProps {
  field: FormField;
}

export const RavenRepeaterField = memo<RavenRepeaterFieldProps>(({ field }) => {
  const config: RepeaterConfig = field.repeaterConfig ?? { fields: [] };
  const minRows = config.minRows ?? 0;
  const maxRows = config.maxRows ?? 10;

  const [rowIds, setRowIds] = React.useState<string[]>(() =>
    Array.from({ length: Math.max(minRows, 1) }, genId),
  );

  const canAdd = rowIds.length < maxRows;
  const canRemove = rowIds.length > minRows;

  const addRow = useCallback(() => {
    if (canAdd) setRowIds((prev) => [...prev, genId()]);
  }, [canAdd]);

  const removeRow = useCallback((id: string) => {
    setRowIds((prev) => prev.filter((rid) => rid !== id));
  }, []);

  return (
    <div className="col-span-12 flex flex-col gap-3">
      {field.label && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{field.label}</p>
            {field.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
            )}
          </div>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {rowIds.length} / {maxRows}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {rowIds.map((id, index) => (
          <RepeaterRow
            key={id}
            rowId={id}
            rowIndex={index}
            config={config}
            namePrefix={field.name}
            canRemove={canRemove && rowIds.length > 1}
            onRemove={removeRow}
          />
        ))}
      </div>

      {canAdd && (
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="self-start gap-1.5 text-xs">
          + {config.addLabel ?? "افزودن ردیف"}
        </Button>
      )}
      {!canAdd && (
        <p className="text-xs text-muted-foreground">
          حداکثر {maxRows} ردیف مجاز است.
        </p>
      )}
    </div>
  );
});
RavenRepeaterField.displayName = "RavenRepeaterField";
