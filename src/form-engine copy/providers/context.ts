"use client";

// ─── Raven Form — Adapter Contexts ────────────────────────────────────────────
// This module creates the React contexts that back the provider-driven adapter
// architecture. Consumers must not import these directly — use the hooks in
// `./hooks` instead.

import { createContext } from "react";
import type { UIAdapter, FormAdapter } from "../types";

// ─── Slot types for future extensibility ──────────────────────────────────────

/**
 * The full registry of adapter slots available through context.
 * Keep fields optional so the registry can be built incrementally
 * (e.g. only uiAdapter is required, formAdapter is optional at the
 *  provider level when using per-form adapters).
 *
 * Future slots added here will be tree-shaken unless used.
 */
export interface RavenAdapterRegistry {
  /** Renders form controls: Input, Select, DatePicker, etc. */
  uiAdapter: UIAdapter;

  /** Manages form state & validation: RHF, Formik, Final Form, etc. */
  formAdapter?: FormAdapter;

  /**
   * @future — Custom validation engine (e.g. Zod, Yup, Valibot).
   * Reserved for future plugin architecture.
   */
  // validationAdapter?: ValidationAdapter;

  /**
   * @future — Internationalisation provider.
   */
  // i18nAdapter?: I18nAdapter;

  /**
   * @future — Theme/design-token override.
   */
  // themeAdapter?: ThemeAdapter;
}

// ─── UI Adapter Context ───────────────────────────────────────────────────────

/**
 * Provides the active {@link UIAdapter} to all descendant form components.
 *
 * Direct consumers should use {@link useUIAdapter} instead of this context.
 */
export const UIAdapterContext = createContext<UIAdapter | null>(null);
UIAdapterContext.displayName = "RavenUIAdapterContext";

// ─── Form Adapter Context ─────────────────────────────────────────────────────

/**
 * Provides the active {@link FormAdapter} to all descendant form components.
 *
 * Direct consumers should use {@link useFormAdapter} instead of this context.
 */
export const FormAdapterContext = createContext<FormAdapter | null>(null);
FormAdapterContext.displayName = "RavenFormAdapterContext";

// ─── Full Registry Context ────────────────────────────────────────────────────

/**
 * Provides the combined {@link RavenAdapterRegistry}.
 * Useful for adapter authors who need to introspect the full registry at once.
 */
export const RavenAdapterRegistryContext =
  createContext<RavenAdapterRegistry | null>(null);
RavenAdapterRegistryContext.displayName = "RavenAdapterRegistryContext";
