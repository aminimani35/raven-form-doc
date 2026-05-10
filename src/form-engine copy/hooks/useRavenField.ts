"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormField, FieldBinding } from "../types";
import { applyMask } from "../core/mask";
import type { MaskOptions } from "../core/mask";
import { applyFormatter, applyParser } from "../utils/formatter";

interface UseRavenFieldOptions {
  field: FormField;
  binding: FieldBinding;
  /** debounce ms for async validation (default 400) */
  debounceMs?: number;
}

interface RavenFieldResult extends FieldBinding {
  handleChange: (rawValue: unknown) => void;
  displayValue: unknown;
  isValidating: boolean;
}

/**
 * Applies mask -> formatter -> parser pipeline on top of a raw FieldBinding.
 *
 * The mask field now accepts:
 *  - A pattern string e.g. '(***) ***-****'  -> used directly with new engine
 *  - A MaskOptions object                    -> full config
 *  - A function (value: string) => string    -> custom transform
 */
export function useRavenField({
  field,
  binding,
  debounceMs = 400,
}: UseRavenFieldOptions): RavenFieldResult {
  const { onChange, value } = binding;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const displayValue = field.parser ? applyParser(value, field.parser) : value;

  const handleChange = useCallback(
    (rawValue: unknown) => {
      let processed: unknown = rawValue;

      // 1. Apply mask
      if (field.mask && typeof processed === 'string') {
        const mask = field.mask as string | MaskOptions | ((v: string) => string);
        if (typeof mask === 'function') {
          processed = mask(processed);
        } else {
          // Pattern string or MaskOptions — use the new engine; store raw value
          processed = applyMask(processed, mask).raw;
        }
      }

      // 2. Apply formatter
      if (field.formatter) {
        processed = applyFormatter(processed, field.formatter);
      }

      // 3. Async validation debounce signal
      if (field.validation?.asyncCustom) {
        setIsValidating(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          setIsValidating(false);
        }, debounceMs);
      }

      onChange(processed);
    },
    [field.mask, field.formatter, field.validation?.asyncCustom, onChange, debounceMs],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    ...binding,
    handleChange,
    displayValue,
    isValidating,
  };
}