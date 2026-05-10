---
layout: home

hero:
  name: "Raven Form"
  text: "Schema-First. UI-Agnostic. Production-Ready."
  tagline: Describe your form once as a plain JavaScript object — field types, layout, validation, masking, conditional logic — and render it with any UI library and any form-state library you choose.
  image:
    src: /logo.svg
    alt: Raven Form Logo
  actions:
    - theme: brand
      text: Get Started →
      link: /getting-started
    - theme: alt
      text: API Reference
      link: /api/smart-form
    - theme: alt
      text: View on GitHub
      link: https://github.com/aminimani35/raven-form.git

features:
  - icon: 🧩
    title: Schema-Driven API
    details: Define your entire form as a plain JavaScript object — field types, labels, validation rules, 12-column grid layout, and conditional logic — all in one place. The engine resolves defaults, watches dependencies, and drives rendering automatically.
    link: /getting-started
    linkText: See the schema

  - icon: 🔌
    title: Dual Adapter Architecture
    details: Two independent adapter contracts — FormAdapter (form state) and UIAdapter (components). Combine React Hook Form with ShadCN, Ant Design Form with Ant Design components, or mix any pairing. Per-form overrides shadow the global provider.
    link: /guide/adapters
    linkText: Explore adapters

  - icon: 🎨
    title: Headless Rendering Engine
    details: resolveFieldComponent performs a 4-step lookup — exact type match → text-family fallback → catch-all fallback → dev warning. No switch/case in your code. Register only what you need; the rest fall back gracefully.
    link: /guide/ui-adapters
    linkText: See UI adapters

  - icon: 🧭
    title: Multi-Step Wizard
    details: RavenWizardForm renders a StepBar, gates step advancement via the optional useTrigger hook for per-step validation, and tracks completed steps automatically. No extra configuration needed.
    link: /guide/wizard
    linkText: Build a wizard

  - icon: 🔁
    title: Dynamic Repeater Fields
    details: RavenRepeaterField lets users add and remove rows of sub-fields at runtime. Configure minRows, maxRows, defaultRow values, addLabel, removeLabel, and full nested validation out of the box.
    link: /guide/repeater
    linkText: Use repeaters

  - icon: ✅
    title: Rich Validation Pipeline
    details: Sync required, min, max, minLength, maxLength, pattern, cross-field custom validators, and async validators — debounced 400 ms with a built-in isValidating spinner. All unified behind a single FieldValidation interface.
    link: /guide/validation
    linkText: Validation docs

  - icon: 🎭
    title: 22 Built-in Field Types
    details: "text · email · tel · url · number · password · textarea · date · time · datetime · select · multiselect · radio · checkbox · switch · otp · file · range · color · rating · repeater · custom. Anything else? Use type=\"custom\" + render."
    link: /guide/field-types
    linkText: All field types

  - icon: 🔡
    title: Flexible Input Masking
    details: "The mask property accepts three forms: a pattern string like '(***) ***-****', a full MaskOptions config object, or a plain (value) => string function. Built-in named masks cover phone, IBAN, national code, bank card, OTP, and currency."
    link: /guide/masks
    linkText: Masking guide

  - icon: 🔄
    title: Formatter & Parser Pipeline
    details: useRavenField runs raw input → mask → formatter → store on change, and store → parser → display on read. Use built-in named transforms (currency, titleCase, trim, upper, lower) or register your own.
    link: /guide/formatters
    linkText: Formatters guide

  - icon: 👁️
    title: Conditional Fields
    details: hidden and disabled accept a boolean or a (formValues) => boolean predicate. List field names in dependsOn to selectively subscribe — the engine only re-evaluates fields that actually depend on changed values.
    link: /guide/field-types
    linkText: Conditional logic

  - icon: 📐
    title: 12-Column Responsive Grid
    details: Every field carries a colSpan (1–12) mapped to a CSS grid with gridTemplateColumns. Override columns at the FormSchema level or per wizard step. Gap is configurable via the gap property.
    link: /getting-started
    linkText: Layout docs

  - icon: 🛠️
    title: Custom Field Escape Hatch
    details: type="custom" with a render function gives you a FieldRenderContext containing value, onChange, onBlur, error, disabled, label, and placeholder. Full control — yet it still lives inside the form's Provider tree.
    link: /guide/custom-fields
    linkText: Custom fields

  - icon: 🌐
    title: Global Provider + Per-Form Overrides
    details: Wrap your app in <RavenFormProvider uiAdapter={...} formAdapter={...}> for zero-prop-drilling defaults. Pass adapter or ui directly on any <RavenForm /> to shadow the global ones for that instance only.
    link: /guide/adapters
    linkText: Provider docs

  - icon: 🔧
    title: Typed Adapter Factories
    details: createUIAdapter() and createFormAdapter() run dev-mode validation against their contracts — missing required keys surface as warnings immediately. Both return their input unchanged so TypeScript retains exact component types.
    link: /guide/custom-adapter
    linkText: Build an adapter
---

<div class="landing-extra">

<div class="landing-section architecture-section">
  <div class="section-badge">How it works</div>
  <h2 class="section-title">Two adapter contracts. Total separation of concerns.</h2>
  <p class="section-sub">Raven Form splits rendering responsibility into two orthogonal contracts that are composed at runtime, not compile time.</p>

  <div class="arch-grid">
    <div class="arch-card">
      <div class="arch-icon">🔌</div>
      <h3>FormAdapter</h3>
      <p>Owns form state, validation, and submission. Implement <code>Provider</code>, <code>useField</code>, <code>useSubmit</code>, <code>useWatch</code>, and optionally <code>useTrigger</code> for wizard step gating.</p>
      <div class="arch-tag">React Hook Form · Ant Design Form · Formik · custom</div>
    </div>
    <div class="arch-plus">+</div>
    <div class="arch-card">
      <div class="arch-icon">🎨</div>
      <h3>UIAdapter</h3>
      <p>Owns visual rendering. Register components by field type, supply an optional <code>FormItem</code> wrapper for label/error chrome, mark <code>inlineTypes</code>, and set a <code>fallback</code> for unknown types.</p>
      <div class="arch-tag">ShadCN · Ant Design · MUI · Chakra · custom HTML</div>
    </div>
    <div class="arch-equals">=</div>
    <div class="arch-card arch-result">
      <div class="arch-icon">⚡</div>
      <h3>RavenForm</h3>
      <p>The engine merges schema defaults, resolves adapters (prop > provider context), and drives the headless render pipeline — no hardcoded UI assumption anywhere.</p>
      <div class="arch-tag">Schema-driven · Zero coupling · Fully typed</div>
    </div>
  </div>
</div>

<div class="landing-section pipeline-section">
  <div class="section-badge">Value pipeline</div>
  <h2 class="section-title">Every keystroke flows through a predictable pipeline.</h2>
  <div class="pipeline">
    <div class="pipeline-step">
      <span class="pipe-num">1</span>
      <div>
        <strong>Raw input event</strong>
        <p>User types / selects / toggles</p>
      </div>
    </div>
    <div class="pipe-arrow">→</div>
    <div class="pipeline-step">
      <span class="pipe-num">2</span>
      <div>
        <strong>Mask</strong>
        <p>Pattern string, MaskOptions, or function — stores <code>.raw</code></p>
      </div>
    </div>
    <div class="pipe-arrow">→</div>
    <div class="pipeline-step">
      <span class="pipe-num">3</span>
      <div>
        <strong>Formatter</strong>
        <p>Transform value before storing in form state</p>
      </div>
    </div>
    <div class="pipe-arrow">→</div>
    <div class="pipeline-step">
      <span class="pipe-num">4</span>
      <div>
        <strong>Form state</strong>
        <p>Stored via FormAdapter <code>useField.onChange</code></p>
      </div>
    </div>
    <div class="pipe-arrow">→</div>
    <div class="pipeline-step">
      <span class="pipe-num">5</span>
      <div>
        <strong>Parser</strong>
        <p>Transform stored value back to display on read</p>
      </div>
    </div>
  </div>
  <p class="pipeline-note">Async validators are debounced (default 400 ms). A <code>Spinner</code> is shown automatically while <code>isValidating</code> is true — no extra code required.</p>
</div>

<div class="landing-section demo-section">
  <div class="section-badge">Quick start</div>
  <h2 class="section-title">From schema to production form in seconds.</h2>
  <p class="section-sub">One component. One schema object. Plug in your adapters and ship.</p>

```tsx
import { RavenForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const schema = {
  columns: 12,
  fields: [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      colSpan: 6,
      validation: { required: true, minLength: 2 },
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      colSpan: 6,
      validation: { required: true },
    },
    {
      name: "phone",
      type: "tel",
      label: "Phone",
      colSpan: 6,
      // mask accepts a pattern string, MaskOptions object, or function
      mask: "(***) ***-****",
    },
    {
      name: "role",
      type: "select",
      label: "Role",
      colSpan: 6,
      options: [
        { label: "Admin",  value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
    { name: "bio", type: "textarea", label: "Bio", colSpan: 12 },
    {
      name: "sendUpdates",
      type: "switch",
      label: "Receive product updates",
      // inlineTypes (checkbox, switch) skip the FormItem wrapper automatically
    },
    {
      // Conditional field — shown only when role === "admin"
      name: "adminCode",
      type: "password",
      label: "Admin Code",
      colSpan: 6,
      hidden: (values) => values.role !== "admin",
      dependsOn: ["role"],   // subscribe only to "role" changes
      validation: { required: true, minLength: 8 },
    },
  ],
};

export function ProfileForm() {
  return (
    <RavenForm
      schema={schema}
      adapter={RHFAdapter}      // form state — React Hook Form
      ui={ShadCNUIAdapter}      // components — ShadCN/ui
      onSubmit={(values) => console.log(values)}
      submitLabel="Save Profile"
      showReset
    />
  );
}
```

</div>

<div class="landing-section wizard-section">
  <div class="section-badge">Multi-step</div>
  <h2 class="section-title">Turn any schema into a guided wizard — zero extra setup.</h2>
  <p class="section-sub">RavenWizardForm renders a StepBar, gates step advancement with per-step field validation via <code>useTrigger</code>, and tracks completed steps automatically.</p>

```tsx
import { RavenWizardForm } from "raven-form";
import { RHFAdapter } from "raven-form/adapters/rhf";
import { ShadCNUIAdapter } from "raven-form/ui/shadcn";

const steps = [
  {
    id: "personal",
    title: "Personal Info",
    icon: "👤",
    fields: [
      { name: "firstName", type: "text",  label: "First Name", colSpan: 6,  validation: { required: true } },
      { name: "lastName",  type: "text",  label: "Last Name",  colSpan: 6,  validation: { required: true } },
      { name: "email",     type: "email", label: "Email",      colSpan: 12, validation: { required: true } },
    ],
  },
  {
    id: "account",
    title: "Account",
    icon: "🔑",
    fields: [
      { name: "username", type: "text",     label: "Username", colSpan: 6, validation: { required: true } },
      { name: "password", type: "password", label: "Password", colSpan: 6, validation: { required: true, minLength: 8 } },
    ],
  },
  {
    id: "confirm",
    title: "Review",
    icon: "✅",
    fields: [
      { name: "agree", type: "checkbox", label: "I accept the terms and conditions", validation: { required: true } },
    ],
  },
];

export function RegistrationWizard() {
  return (
    <RavenWizardForm
      steps={steps}
      adapter={RHFAdapter}
      ui={ShadCNUIAdapter}
      onSubmit={(values) => console.log("Submitted:", values)}
      submitLabel="Create Account"
    />
  );
}
```

</div>

<div class="landing-section repeater-section">
  <div class="section-badge">Dynamic rows</div>
  <h2 class="section-title">Repeater fields — let users build their own rows.</h2>

```tsx
const schema = {
  fields: [
    {
      name: "contacts",
      type: "repeater",
      label: "Emergency Contacts",
      colSpan: 12,
      repeaterConfig: {
        minRows: 1,
        maxRows: 5,
        addLabel: "+ Add contact",
        removeLabel: "Remove",
        defaultRow: { name: "", phone: "", relation: "family" },
        fields: [
          { name: "name",     type: "text",   label: "Name",     colSpan: 4, validation: { required: true } },
          { name: "phone",    type: "tel",    label: "Phone",    colSpan: 4, mask: "(***) ***-****" },
          {
            name: "relation", type: "select", label: "Relation", colSpan: 4,
            options: [
              { label: "Family",   value: "family" },
              { label: "Friend",   value: "friend" },
              { label: "Coworker", value: "coworker" },
            ],
          },
        ],
      },
    },
  ],
};
```

</div>

<div class="landing-section custom-adapter-section">
  <div class="section-badge">Adapters</div>
  <h2 class="section-title">Build your own adapter in minutes.</h2>
  <p class="section-sub"><code>createFormAdapter</code> and <code>createUIAdapter</code> validate your implementation against the contracts in development mode, then return the adapter typed exactly — no type erasure.</p>

```tsx
import { createFormAdapter, createUIAdapter, RavenFormProvider } from "raven-form";

// ── UIAdapter — map field types to your components ──────────────────────────
export const myUIAdapter = createUIAdapter({
  components: {
    text:      MyInput,
    email:     MyInput,    // text-family: engine injects type="email" automatically
    textarea:  MyTextarea,
    select:    MySelect,
    checkbox:  MyCheckbox,
    switch:    MySwitch,
    // Unregistered types fall back: ui.components["text"] → ui.fallback → dev warning
  },
  FormItem:    MyFormItem,             // label + error + description wrapper
  inlineTypes: ["checkbox", "switch"], // these skip FormItem chrome (default)
  fallback:    MyDebugField,           // catch-all for unknown types
});

// ── FormAdapter — wire your form-state library ──────────────────────────────
export const myFormAdapter = createFormAdapter({
  Provider:   MyFormProvider,   // wraps <form> + context; calls onSubmit
  useField:   (name) => ({ value, onChange, onBlur, error }),
  useSubmit:  () => () => formRef.current?.submit(),
  useWatch:   (names?) => currentValues,
  // Optional — enables RavenWizardForm per-step validation gating:
  useTrigger: () => (names) => validateFieldsAndReturnBoolean(names),
});

// ── Global provider — set once, inherited by every <RavenForm> ─────────────
function App() {
  return (
    <RavenFormProvider uiAdapter={myUIAdapter} formAdapter={myFormAdapter}>
      <YourApp />
      {/* Per-form override: <RavenForm adapter={otherAdapter} ui={otherUI} ... /> */}
    </RavenFormProvider>
  );
}
```

</div>

</div>

<style>
/* ─── Landing Extra Container ─────────────────────────────────────────────── */
.landing-extra {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 96px;
}

/* ─── Sections ────────────────────────────────────────────────────────────── */
.landing-section {
  margin-top: 72px;
  padding: 48px 44px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  position: relative;
  overflow: hidden;
}

.landing-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, var(--vp-c-brand-soft) 0%, transparent 65%);
  opacity: 0.4;
  pointer-events: none;
}

/* ─── Section Badge ───────────────────────────────────────────────────────── */
.section-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.section-title {
  position: relative;
  font-size: clamp(1.3rem, 2.4vw, 1.8rem);
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 12px;
  background: linear-gradient(135deg, var(--vp-c-text-1) 30%, var(--vp-c-brand-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-sub {
  position: relative;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
  max-width: 680px;
  line-height: 1.75;
}

/* ─── Architecture Grid ───────────────────────────────────────────────────── */
.arch-grid {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-wrap: wrap;
}

.arch-card {
  flex: 1;
  min-width: 200px;
  padding: 28px 24px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: box-shadow 0.2s, transform 0.2s;
}

.arch-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);
  transform: translateY(-3px);
}

.arch-result {
  border-color: var(--vp-c-brand-1);
  background: linear-gradient(135deg, var(--vp-c-bg) 55%, var(--vp-c-brand-soft));
}

.arch-icon {
  font-size: 2rem;
  margin-bottom: 12px;
  line-height: 1;
}

.arch-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 8px;
  border: none;
  padding: 0;
  letter-spacing: -0.01em;
}

.arch-card p {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0 0 14px;
}

.arch-tag {
  font-size: 0.72rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  padding: 4px 10px;
  background: var(--vp-c-brand-soft);
  border-radius: 8px;
  display: inline-block;
}

.arch-plus,
.arch-equals {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 200;
  color: var(--vp-c-text-3);
  padding: 0 10px;
  flex-shrink: 0;
}

/* ─── Pipeline ────────────────────────────────────────────────────────────── */
.pipeline {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.pipeline-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  flex: 1;
  min-width: 130px;
  transition: box-shadow 0.2s;
}

.pipeline-step:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.pipeline-step strong {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--vp-c-text-1);
}

.pipeline-step p {
  font-size: 0.76rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.pipe-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

.pipe-arrow {
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  align-self: center;
}

.pipeline-note {
  position: relative;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 14px;
  line-height: 1.7;
}

/* ─── Code blocks inside sections ────────────────────────────────────────── */
.landing-section .vp-doc div[class*="language-"] {
  margin: 0;
  border-radius: 14px;
  position: relative;
}

/* ─── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .landing-extra {
    padding: 0 16px 64px;
  }

  .landing-section {
    padding: 28px 20px;
    margin-top: 48px;
  }

  .arch-grid {
    flex-direction: column;
  }

  .arch-plus,
  .arch-equals {
    padding: 2px 0;
    font-size: 1.2rem;
  }

  .pipeline {
    flex-direction: column;
    align-items: stretch;
  }

  .pipe-arrow {
    transform: rotate(90deg);
    align-self: flex-start;
    padding-left: 20px;
  }
}
</style>
