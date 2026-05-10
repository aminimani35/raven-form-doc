"use client";

// ─── Raven Form — Global Provider ────────────────────────────────────────────
// <RavenFormProvider uiAdapter={antdUI} formAdapter={rhfAdapter}>
//   <App />
// </RavenFormProvider>
//
// Both adapters are injectable globally so every <RavenForm /> inside the
// tree automatically inherits them without any prop-drilling.
//
// Per-form overrides: pass `adapter` / `ui` directly on <RavenForm /> to
// shadow the global ones for a single form instance.

import { memo, useMemo, type ReactNode } from "react";
import {
  UIAdapterContext,
  FormAdapterContext,
  RavenAdapterRegistryContext,
  type RavenAdapterRegistry,
} from "./context";
import type { UIAdapter, FormAdapter } from "../types";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface RavenFormProviderProps {
  /**
   * The UI adapter that renders all form controls.
   *
   * @example antdUI  — Ant Design components
   * @example shadcnUI — shadcn/ui (Radix-backed) components
   */
  uiAdapter: UIAdapter;

  /**
   * The form state / validation adapter.
   *
   * Optional at the provider level: you can omit it here and supply it
   * per-form via the {@link RavenFormProps.adapter} prop if your app uses
   * multiple form libraries.
   *
   * @example RHFAdapter    — react-hook-form
   * @example AntDAdapter   — Ant Design Form
   */
  formAdapter?: FormAdapter;

  /**
   * Any extra adapter slots registered for the full registry
   * (used by advanced plugin consumers).
   */
  registry?: Omit<RavenAdapterRegistry, "uiAdapter" | "formAdapter">;

  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Global Raven Form adapter provider.
 *
 * Wrap your application (or a sub-tree) with this provider to configure
 * which UI components and form-state library every nested `<RavenForm />`
 * and `<RavenWizardForm />` will use.
 *
 * @example
 * ```tsx
 * import { RavenFormProvider } from "raven-form-engine"
 * import { AntDAdapter }       from "raven-form-engine/adapters/antd"
 * import { RHFAdapter }        from "raven-form-engine/adapters/rhf"
 * import { antdUI }            from "raven-form-engine/ui/antd"
 *
 * <RavenFormProvider uiAdapter={antdUI} formAdapter={RHFAdapter}>
 *   <App />
 * </RavenFormProvider>
 * ```
 */
export const RavenFormProvider = memo<RavenFormProviderProps>(
  ({ uiAdapter, formAdapter, registry, children }) => {
    // Memoize the full registry object so context consumers only re-render
    // when adapter references actually change.
    const fullRegistry: RavenAdapterRegistry = useMemo(
      () => ({ uiAdapter, formAdapter, ...registry }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [uiAdapter, formAdapter, registry],
    );

    return (
      <RavenAdapterRegistryContext.Provider value={fullRegistry}>
        <UIAdapterContext.Provider value={uiAdapter}>
          <FormAdapterContext.Provider value={formAdapter ?? null}>
            {children}
          </FormAdapterContext.Provider>
        </UIAdapterContext.Provider>
      </RavenAdapterRegistryContext.Provider>
    );
  },
);
RavenFormProvider.displayName = "RavenFormProvider";
