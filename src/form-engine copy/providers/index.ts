// ─── Raven Form — Providers Public API ───────────────────────────────────────

// ── Provider component
export { RavenFormProvider } from "./RavenFormProvider";
export type { RavenFormProviderProps } from "./RavenFormProvider";

// ── Context (for adapter authors / advanced use)
export {
  UIAdapterContext,
  FormAdapterContext,
  RavenAdapterRegistryContext,
} from "./context";
export type { RavenAdapterRegistry } from "./context";

// ── Consumer hooks (primary public API)
export {
  useUIAdapter,
  useUIAdapterOrProp,
  useFormAdapter,
  useFormAdapterOrProp,
  useAdapterRegistry,
} from "./hooks";
