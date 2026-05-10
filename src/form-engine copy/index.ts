// --- Components ---
export { RavenForm } from './RavenForm';
export { RavenWizardForm } from './RavenWizardForm';
export { RavenRepeaterField } from './RavenRepeaterField';

// --- Provider ---
export { RavenFormProvider } from './providers';
export type { RavenFormProviderProps, RavenAdapterRegistry } from './providers';
export {
  UIAdapterContext,
  FormAdapterContext,
  RavenAdapterRegistryContext,
  useUIAdapter,
  useUIAdapterOrProp,
  useFormAdapter,
  useFormAdapterOrProp,
  useAdapterRegistry,
} from './providers';

// --- Adapter Authoring Utilities ---
export {
  createUIAdapter,
  createFormAdapter,
  validateUIAdapter,
  validateFormAdapter,
} from './adapter-utils';

// --- Rendering Pipeline (for advanced adapter authors) ---
export { resolveFieldComponent, buildFieldProps, isInlineType } from './renderer';

// --- Types ---
export type {
  FieldType,
  FormField,
  FieldValidation,
  FieldRenderContext,
  FieldBinding,
  FormSchema,
  WizardStep,
  RepeaterConfig,
  FormAdapter,
  FormAdapterProviderProps,
  UIAdapter,
  UIFieldProps,
  UIFormItemProps,
  RavenFormProps,
  RavenWizardFormProps,
} from './types';

// --- Hooks ---
export { useRavenField } from './hooks/useRavenField';

// --- Mask Engine ---
export {
  applyMask,
  removeMask,
  isMaskComplete,
  handlePaste as handleMaskPaste,
  processInputChange,
  BUILTIN_TOKENS,
  DEFAULT_WILDCARD_TOKEN,
  DIGIT_TOKEN,
  ALPHA_UPPER_TOKEN,
  ALPHA_LOWER_TOKEN,
  ALPHANUM_TOKEN,
  maskPhone,
  maskBankCard,
  maskCurrency,
  maskNationalCode,
  maskPostalCode,
  maskOTP,
  maskRegistry,
} from './utils/mask';

export type {
  MaskToken,
  MaskTokenMap,
  MaskOptions,
  MaskResult,
  MaskMutationResult,
} from './utils/mask';

export { useMask } from './core/mask';
export type { UseMaskOptions, UseMaskResult } from './core/mask';

// --- Formatting Utilities ---
export {
  formatCurrency,
  formatTrim,
  parseCurrency,
  formatterRegistry,
  parserRegistry,
  applyFormatter,
  applyParser,
} from './utils/formatter';

// --- Validation Utilities ---
// normalizeError is generic. buildRHFRules is exported as a convenience for
// consumers building their own React Hook Form adapters externally.
export { normalizeError, buildRHFRules } from './utils/validation';

// --- Primitives (for adapter authors) ---
export { Button, Spinner } from './components/Button';
export type { ButtonProps } from './components/Button';
export { cn } from './utils/cn';
