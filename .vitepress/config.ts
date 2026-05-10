import { defineConfig } from "vitepress";
import { writeFileSync } from "fs";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

const enSidebar = [
  {
    text: "🚀 Introduction",
    items: [{ text: "Getting Started", link: "/getting-started" }],
  },
  {
    text: "📖 Core Concepts",
    items: [
      { text: "Field Types", link: "/guide/field-types" },
      { text: "Validation", link: "/guide/validation" },
    ],
  },
  {
    text: "🎨 UI Adapters",
    items: [
      { text: "Overview", link: "/guide/ui-adapters" },
      { text: "Custom UI Adapter", link: "/guide/custom-ui-adapter" },
      { text: "Ant Design", link: "/examples/antd" },
      { text: "ShadCN / ui", link: "/examples/shadcn" },
    ],
  },
  {
    text: "🔌 Form Adapters",
    items: [
      { text: "Overview", link: "/guide/adapters" },
      { text: "React Hook Form", link: "/guide/rhf" },
      { text: "Formik", link: "/guide/formik" },
      { text: "Custom Adapter", link: "/guide/custom-adapter" },
    ],
  },
  {
    text: "⚡ Advanced",
    items: [
      { text: "Wizard Forms", link: "/guide/wizard" },
      { text: "Repeater Fields", link: "/guide/repeater" },
      { text: "Masks", link: "/guide/masks" },
      { text: "Formatters & Parsers", link: "/guide/formatters" },
      { text: "Custom Fields", link: "/guide/custom-fields" },
    ],
  },
  {
    text: "📚 API Reference",
    items: [
      { text: "RavenForm", link: "/api/smart-form" },
      { text: "RavenWizard", link: "/api/smart-wizard-form" },
      { text: "RavenRepeater", link: "/api/smart-repeater-field" },
      { text: "Types", link: "/api/types" },
    ],
  },
];

const faSidebar = [
  {
    text: "🚀 شروع کار",
    items: [{ text: "شروع سریع", link: "/fa/getting-started" }],
  },
  {
    text: "📖 مفاهیم اصلی",
    items: [
      { text: "انواع فیلد", link: "/fa/guide/field-types" },
      { text: "اعتبارسنجی", link: "/fa/guide/validation" },
    ],
  },
  {
    text: "🎨 آداپتورهای UI",
    items: [
      { text: "معرفی", link: "/fa/guide/ui-adapters" },
      { text: "UIAdapter سفارشی", link: "/fa/guide/custom-ui-adapter" },
      { text: "Ant Design", link: "/fa/examples/antd" },
      { text: "ShadCN / ui", link: "/fa/examples/shadcn" },
    ],
  },
  {
    text: "🔌 آداپتورهای فرم",
    items: [
      { text: "معرفی", link: "/fa/guide/adapters" },
      { text: "React Hook Form", link: "/fa/guide/rhf" },
      { text: "Formik", link: "/fa/guide/formik" },
      { text: "آداپتور سفارشی", link: "/fa/guide/custom-adapter" },
    ],
  },
  {
    text: "⚡ پیشرفته",
    items: [
      { text: "فرم‌های چندمرحله‌ای", link: "/fa/guide/wizard" },
      { text: "فیلد تکرارشونده", link: "/fa/guide/repeater" },
      { text: "Mask ورودی", link: "/fa/guide/masks" },
      { text: "فرمتر و پارسر", link: "/fa/guide/formatters" },
      { text: "فیلد سفارشی", link: "/fa/guide/custom-fields" },
    ],
  },
  {
    text: "📚 مرجع API",
    items: [
      { text: "RavenForm", link: "/fa/api/smart-form" },
      { text: "RavenWizard", link: "/fa/api/smart-wizard-form" },
      { text: "انواع (Types)", link: "/fa/api/types" },
    ],
  },
];

export default defineConfig({
  title: "Raven Form",
  description:
    "A powerful, adapter-driven form engine for React — schema-first, UI-agnostic, fully type-safe.",
  base: "/raven-form-doc/",

  vite: {
    plugins: [react()],
  },

  markdown: {
    theme: {
      light: "one-dark-pro",
      dark: "one-dark-pro",
    },
  },

  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    ["meta", { name: "theme-color", content: "#7c3aed" }],
    ["meta", { property: "og:title", content: "Raven Form" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Powerful schema-driven form engine for React",
      },
    ],
  ],

  buildEnd({ outDir }) {
    const nojekyllPath = resolve(outDir, ".nojekyll");
    writeFileSync(nojekyllPath, "", "utf-8");
  },

  locales: {
    root: {
      label: "English",
      lang: "en",
      themeConfig: {
        nav: [
          { text: "Home", link: "/" },
          { text: "Getting Started", link: "/getting-started" },
          {
            text: "Guide",
            items: [
              { text: "─ Core", link: "" },
              { text: "Field Types", link: "/guide/field-types" },
              { text: "Validation", link: "/guide/validation" },
              { text: "UI Adapters", link: "/guide/ui-adapters" },
              { text: "─ Adapters", link: "" },
              { text: "React Hook Form", link: "/guide/rhf" },
              { text: "Formik", link: "/guide/formik" },
              { text: "Custom Adapter", link: "/guide/custom-adapter" },
              { text: "─ Advanced", link: "" },
              { text: "Wizard Forms", link: "/guide/wizard" },
              { text: "Repeater", link: "/guide/repeater" },
              { text: "Masks", link: "/guide/masks" },
              { text: "Formatters", link: "/guide/formatters" },
            ],
          },
          {
            text: "Examples",
            items: [
              { text: "Ant Design", link: "/examples/antd" },
              { text: "ShadCN / ui", link: "/examples/shadcn" },
            ],
          },
          { text: "API", link: "/api/smart-form" },
          { text: "فارسی 🇮🇷", link: "/fa/" },
        ],
        sidebar: enSidebar,
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/aminimani35/raven-form.git",
          },
        ],
        footer: {
          message: "Released under the MIT License.",
          copyright: "Copyright © 2025 Raven Form",
        },
        search: { provider: "local" },
      },
    },

    fa: {
      label: "فارسی",
      lang: "fa",
      link: "/fa/",
      dir: "rtl",
      themeConfig: {
        nav: [
          { text: "خانه", link: "/fa/" },
          { text: "شروع سریع", link: "/fa/getting-started" },
          {
            text: "راهنما",
            items: [
              { text: "انواع فیلد", link: "/fa/guide/field-types" },
              { text: "اعتبارسنجی", link: "/fa/guide/validation" },
              { text: "React Hook Form", link: "/fa/guide/rhf" },
              { text: "Formik", link: "/fa/guide/formik" },
              { text: "فرم چندمرحله‌ای", link: "/fa/guide/wizard" },
              { text: "فیلد تکرارشونده", link: "/fa/guide/repeater" },
              { text: "Mask ورودی", link: "/fa/guide/masks" },
            ],
          },
          {
            text: "نمونه‌ها",
            items: [
              { text: "Ant Design", link: "/fa/examples/antd" },
              { text: "ShadCN / ui", link: "/fa/examples/shadcn" },
            ],
          },
          { text: "English 🌐", link: "/" },
        ],
        sidebar: faSidebar,
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/aminimani35/raven-form.git",
          },
        ],
        footer: {
          message: "منتشر شده تحت مجوز MIT.",
          copyright: "کپی‌رایت © ۱۴۰۴ Raven Form",
        },
        search: { provider: "local" },
        outline: { label: "در این صفحه" },
        docFooter: { prev: "صفحه قبلی", next: "صفحه بعدی" },
        darkModeSwitchLabel: "ظاهر",
        sidebarMenuLabel: "منو",
        returnToTopLabel: "بازگشت به بالا",
        langMenuLabel: "زبان",
      },
    },

    es: {
      label: "Español",
      lang: "es",
      link: "/es/",
      themeConfig: {
        nav: [
          { text: "Inicio", link: "/es/" },
          { text: "Comenzar", link: "/es/getting-started" },
        ],
        sidebar: [
          {
            text: "Guía",
            items: [{ text: "Comenzar", link: "/es/getting-started" }],
          },
        ],
      },
    },

    fr: {
      label: "Français",
      lang: "fr",
      link: "/fr/",
      themeConfig: {
        nav: [
          { text: "Accueil", link: "/fr/" },
          { text: "Commencer", link: "/fr/getting-started" },
        ],
        sidebar: [
          {
            text: "Guide",
            items: [{ text: "Commencer", link: "/fr/getting-started" }],
          },
        ],
      },
    },
  },

  themeConfig: {
    search: { provider: "local" },
    socialLinks: [
      { icon: "github", link: "https://github.com/aminimani35/raven-form.git" },
    ],
  },
});
