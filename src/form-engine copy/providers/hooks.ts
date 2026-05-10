"use client";

// ─── Raven Form — Adapter Consumer Hooks ─────────────────────────────────────
// These hooks are the single public API for reading adapter values out of
// context. Internal components and user code should use these — never consume
// UIAdapterContext / FormAdapterContext directly.

import { useContext } from "react";
import {
  UIAdapterContext,
  FormAdapterContext,
  RavenAdapterRegistryContext,
  type RavenAdapterRegistry,
} from "./context";
import type { UIAdapter, FormAdapter } from "../types";

// ─── useUIAdapter ─────────────────────────────────────────────────────────────

/**
 * Returns the active {@link UIAdapter} from the nearest
 * {@link RavenFormProvider}. Throws a descriptive error when called outside a
 * provider tree — this is intentional to surface misconfiguration early.
 *
 * Per-form override: components that receive an explicit `ui` prop should call
 * `useUIAdapterOrProp(ui)` instead.
 *
 * @example
 * const ui = useUIAdapter()
 * return <ui.Input value={...} onChange={...} />
 */
export function useUIAdapter(): UIAdapter {
  const adapter = useContext(UIAdapterContext);
  if (!adapter) {
    throw new Error(
      "[RavenForm] useUIAdapter() was called outside of <RavenFormProvider>. " +
        "Wrap your app (or the relevant sub-tree) with " +
        "<RavenFormProvider uiAdapter={...} />.",
    );
  }
  return adapter;
}

/**
 * Returns the active UIAdapter, preferring an explicitly passed `override`
 * over the context value. Use this inside components that accept an optional
 * `ui` prop for per-form customisation.
 *
 * @example
 * function RavenForm({ ui }: { ui?: UIAdapter }) {
 *   const resolvedUI = useUIAdapterOrProp(ui)
 *   ...
 * }
 */
export function useUIAdapterOrProp(override?: UIAdapter): UIAdapter {
  const ctx = useContext(UIAdapterContext);
  const resolved = override ?? ctx;
  if (!resolved) {
    throw new Error(
      "[RavenForm] No UIAdapter available. Either wrap your app with " +
        "<RavenFormProvider uiAdapter={...} /> or pass the `ui` prop directly " +
        "to <RavenForm />.",
    );
  }
  return resolved;
}

// ─── useFormAdapter ───────────────────────────────────────────────────────────

/**
 * Returns the active {@link FormAdapter} from the nearest
 * {@link RavenFormProvider}, or `null` if none was registered.
 *
 * Most components should use {@link useFormAdapterOrProp} which also accepts a
 * per-instance override and throws when neither is present.
 *
 * @example
 * const adapter = useFormAdapter()
 * if (!adapter) return <div>Form adapter not configured</div>
 */
export function useFormAdapter(): FormAdapter | null {
  return useContext(FormAdapterContext);
}

/**
 * Returns the active FormAdapter, preferring an explicitly passed `override`
 * over the context value. Throws when neither is available.
 *
 * @example
 * function RavenForm({ adapter }: { adapter?: FormAdapter }) {
 *   const resolvedAdapter = useFormAdapterOrProp(adapter)
 *   ...
 * }
 */
export function useFormAdapterOrProp(override?: FormAdapter): FormAdapter {
  const ctx = useContext(FormAdapterContext);
  const resolved = override ?? ctx;
  if (!resolved) {
    throw new Error(
      "[RavenForm] No FormAdapter available. Either wrap your app with " +
        "<RavenFormProvider formAdapter={...} /> or pass the `adapter` prop " +
        "directly to <RavenForm />.",
    );
  }
  return resolved;
}

// ─── useAdapterRegistry ───────────────────────────────────────────────────────

/**
 * Returns the full {@link RavenAdapterRegistry} — all adapter slots at once.
 * Intended for advanced use-cases (adapter authors, devtools, plugin authors).
 *
 * Returns `null` when called outside a provider. Prefer the individual
 * hooks above for normal component usage.
 */
export function useAdapterRegistry(): RavenAdapterRegistry | null {
  return useContext(RavenAdapterRegistryContext);
}
