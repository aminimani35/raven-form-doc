// ─── Raven Form — useMask React Hook ─────────────────────────────────────────
// Wraps the pure mask engine in a React hook for use with controlled inputs.
//
// Design goals:
//   • No cursor jumping — cursor is restored synchronously via layout effect
//   • Handles: typing, backspace, delete, paste, IME, mobile keyboards
//   • Works with both `<input>` (uncontrolled by the mask) and
//     form-library controlled inputs (pass `value` + `onChange` externally)
//   • SSR-safe (requestAnimationFrame guarded with typeof check)

"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import type { MaskOptions, MaskResult } from "./types";
import {
  applyMask,
  removeMask,
  handleBackspace,
  handleDelete,
  handlePaste,
  processInputChange,
  clearRange,
} from "./engine";

// ─── Public API types ─────────────────────────────────────────────────────────

export interface UseMaskOptions {
  /**
   * The mask pattern (string) or full {@link MaskOptions} config.
   * @example "****-****-**-**"
   * @example { pattern: "####-####", tokens: BUILTIN_TOKENS }
   */
  mask: string | MaskOptions;

  /**
   * Initial raw value. The hook converts this to a masked string on mount.
   */
  initialValue?: string;

  /**
   * Called whenever the masked value changes.
   * Receives `(raw, masked, isComplete)`.
   */
  onChange?: (raw: string, masked: string, isComplete: boolean) => void;

  /**
   * If `true`, the hook manages state internally.
   * If you need a fully controlled input, pass `controlledValue` instead.
   * Default: `true`
   */
  uncontrolled?: boolean;

  /**
   * For controlled usage: the current raw value managed by the parent.
   * The hook formats it. Paired with `onChange` for state updates.
   */
  controlledValue?: string;
}

export interface UseMaskResult {
  /** The current masked string — bind to `<input value={...} />`. */
  value: string;

  /** The raw (unmasked) value — use this as the actual field value. */
  rawValue: string;

  /** Whether every input slot is filled. */
  isComplete: boolean;

  /** Last full mask operation result (includes cursor info). */
  result: MaskResult;

  /**
   * Ref to attach to the `<input>` element.
   * Required for cursor-position restoration after state updates.
   */
  inputRef: React.RefObject<HTMLInputElement | null>;

  // ─── Event handlers ────────────────────────────────────────────────────────

  /** Attach to `<input onChange={...} />`. */
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;

  /** Attach to `<input onKeyDown={...} />`. */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;

  /** Attach to `<input onPaste={...} />`. */
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;

  // ─── Imperative API ────────────────────────────────────────────────────────

  /** Manually set the raw value (e.g. from a date picker or programmatic fill). */
  setValue: (raw: string) => void;

  /** Clear the entire field. */
  clear: () => void;
}

// ─── Implementation ───────────────────────────────────────────────────────────

function raf(fn: () => void): void {
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(fn);
  } else {
    // SSR-safe fallback (e.g. Next.js server render, tests)
    setTimeout(fn, 0);
  }
}

/**
 * React hook that applies pattern-based masking to a text input.
 *
 * @example
 * ```tsx
 * const { value, rawValue, inputRef, onInputChange, onKeyDown, onPaste } =
 *   useMask({ mask: "(***) ***-****", onChange: (raw) => form.setValue("phone", raw) });
 *
 * return (
 *   <input
 *     ref={inputRef}
 *     value={value}
 *     onChange={onInputChange}
 *     onKeyDown={onKeyDown}
 *     onPaste={onPaste}
 *   />
 * );
 * ```
 */
export function useMask({
  mask,
  initialValue = "",
  onChange,
  controlledValue,
}: UseMaskOptions): UseMaskResult {
  // Derive the initial masked string from the initial raw value
  const [result, setResult] = useState<MaskResult>(() =>
    initialValue
      ? applyMask(initialValue, mask)
      : { masked: "", raw: "", complete: false, cursor: 0 },
  );

  // Desired cursor position after the next render — stored in a ref to avoid
  // triggering extra renders.
  const pendingCursor = useRef<number | null>(null);

  // Ref to the <input> DOM element for cursor manipulation
  const inputRef = useRef<HTMLInputElement>(null);

  // When controlled, sync external value into local state
  const isControlled = controlledValue !== undefined;
  const effectiveResult = isControlled
    ? applyMask(controlledValue, mask)
    : result;

  // Restore cursor position synchronously after layout paint (avoids flicker)
  useLayoutEffect(() => {
    if (pendingCursor.current !== null && inputRef.current) {
      const pos = pendingCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  });

  // ─── Internal updater ──────────────────────────────────────────────────────

  const commit = useCallback(
    (next: MaskResult) => {
      pendingCursor.current = next.cursor;
      if (!isControlled) {
        setResult(next);
      }
      onChange?.(next.raw, next.masked, next.complete);
    },
    [isControlled, onChange],
  );

  // ─── onChange (covers IME, mobile autocomplete, cut, drag-drop) ───────────

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = processInputChange(e.target.value, mask);
      commit(next);
    },
    [mask, commit],
  );

  // ─── onKeyDown (backspace / delete — prevents default for fine control) ───

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursor = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? cursor;
      const currentMasked = effectiveResult.masked;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (cursor !== selEnd) {
          // Selection present — clear all input slots within the selection
          const mutation = clearRange(currentMasked, cursor, selEnd, mask);
          const next = applyMask(removeMask(mutation.value, mask), mask);
          commit({ ...next, cursor: mutation.cursor });
        } else {
          const mutation = handleBackspace(currentMasked, cursor, mask);
          const next = applyMask(removeMask(mutation.value, mask), mask);
          commit({ ...next, cursor: mutation.cursor });
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        const mutation = handleDelete(currentMasked, cursor, mask);
        const next = applyMask(removeMask(mutation.value, mask), mask);
        commit({ ...next, cursor: mutation.cursor });
      }
    },
    [effectiveResult.masked, mask, commit],
  );

  // ─── onPaste ──────────────────────────────────────────────────────────────

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text/plain");
      const next = handlePaste(pasted, mask);
      raf(() => {
        commit(next);
      });
    },
    [mask, commit],
  );

  // ─── Imperative API ───────────────────────────────────────────────────────

  const setValue = useCallback(
    (raw: string) => {
      commit(applyMask(raw, mask));
    },
    [mask, commit],
  );

  const clear = useCallback(() => {
    commit({ masked: "", raw: "", complete: false, cursor: 0 });
  }, [commit]);

  return {
    value: effectiveResult.masked,
    rawValue: effectiveResult.raw,
    isComplete: effectiveResult.complete,
    result: effectiveResult,
    inputRef,
    onInputChange,
    onKeyDown,
    onPaste,
    setValue,
    clear,
  };
}
