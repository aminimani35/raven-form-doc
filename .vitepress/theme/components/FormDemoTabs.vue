<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps<{
  /** Key that maps to a named export in .vitepress/demos/index.ts */
  demo: string;
}>();

// ─── Tab state ────────────────────────────────────────────────────────────────
type Tab = "preview" | "code";
const active = ref<Tab>("preview");

// ─── React mount ─────────────────────────────────────────────────────────────
const mountEl = ref<HTMLDivElement | null>(null);
let reactRoot: { unmount(): void } | null = null;

async function mountReact() {
  if (!mountEl.value) return;
  try {
    const [{ createRoot }, React, demos] = await Promise.all([
      import("react-dom/client"),
      import("react"),
      import("../../demos/index"),
    ]);
    const Demo = (demos as Record<string, React.ComponentType>)[props.demo];
    if (!Demo) {
      mountEl.value!.innerHTML = `<p class="demo-not-found">Demo "<strong>${props.demo}</strong>" not found in demos/index.ts.</p>`;
      return;
    }
    reactRoot = createRoot(mountEl.value);
    reactRoot.render(React.createElement(Demo));
  } catch (err) {
    console.error("[FormDemoTabs] Failed to mount React demo:", err);
  }
}

onMounted(async () => {
  await nextTick();
  await mountReact();
});

onBeforeUnmount(() => {
  reactRoot?.unmount();
  reactRoot = null;
});
</script>

<template>
  <div class="fdt-root">
    <!-- ── Tab bar ─────────────────────────────────────────────────────────── -->
    <div class="fdt-tabbar" role="tablist" aria-label="Form demo tabs">
      <button
        role="tab"
        :aria-selected="active === 'preview'"
        class="fdt-tab"
        :class="{ 'fdt-tab--active': active === 'preview' }"
        @click="active = 'preview'"
      >
        <span class="fdt-tab-icon">▶</span>
        Preview
      </button>
      <button
        role="tab"
        :aria-selected="active === 'code'"
        class="fdt-tab"
        :class="{ 'fdt-tab--active': active === 'code' }"
        @click="active = 'code'"
      >
        <span class="fdt-tab-icon">&lt;/&gt;</span>
        Code
      </button>

      <!-- ── Demo label badge ───────────────────────────────────────────────── -->
      <span class="fdt-demo-badge">{{ demo }}</span>
    </div>

    <!-- ── Preview panel ──────────────────────────────────────────────────── -->
    <div
      v-show="active === 'preview'"
      class="fdt-panel fdt-panel--preview"
      role="tabpanel"
    >
      <div ref="mountEl" class="fdt-react-mount" />
    </div>

    <!-- ── Code panel ─────────────────────────────────────────────────────── -->
    <div
      v-show="active === 'code'"
      class="fdt-panel fdt-panel--code"
      role="tabpanel"
    >
      <!--
        VitePress processes markdown inside Vue component slots, so the
        code-fenced block passed as the default slot becomes fully
        syntax-highlighted HTML before arriving here.
      -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ─── Root ──────────────────────────────────────────────────────────────────── */
.fdt-root {
  margin: 28px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

/* ─── Tab bar ────────────────────────────────────────────────────────────── */
.fdt-tabbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 8px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  min-height: 44px;
}

.fdt-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
  border-radius: 0;
  outline: none;
  position: relative;
  top: 1px; /* align bottom border with the tabbar border */
}

.fdt-tab:hover {
  color: var(--vp-c-text-1);
}

.fdt-tab--active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.fdt-tab-icon {
  font-size: 11px;
  opacity: 0.7;
  font-style: normal;
}

/* ─── Demo badge ─────────────────────────────────────────────────────────── */
.fdt-demo-badge {
  margin-left: auto;
  margin-right: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  letter-spacing: 0.02em;
  font-family: var(--vp-font-family-mono);
}

/* ─── Panels ──────────────────────────────────────────────────────────────── */
.fdt-panel {
  position: relative;
}

/* Preview */
.fdt-panel--preview {
  padding: 28px 24px;
  background: var(--vp-c-bg);
  min-height: 80px;
}

.fdt-react-mount {
  /* nothing extra needed — React fills this */
}

/* Code — strip VitePress default margin from the inner <div[class*="language-"]> */
.fdt-panel--code :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
  border: none;
  max-height: 520px;
  overflow-y: auto;
}

.fdt-panel--code :deep(div[class*="language-"] pre) {
  border-radius: 0;
}

/* ─── Error state ─────────────────────────────────────────────────────────── */
:deep(.demo-not-found) {
  margin: 0;
  padding: 12px 16px;
  color: var(--vp-c-danger-1);
  font-size: 13px;
  background: var(--vp-c-danger-soft);
  border-radius: 8px;
}
</style>
