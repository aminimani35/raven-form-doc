<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ demo: string }>();

const el = ref<HTMLElement | null>(null);
let root: { unmount(): void } | null = null;

onMounted(async () => {
  if (!el.value) return;
  const [{ createRoot }, React, demos] = await Promise.all([
    import("react-dom/client"),
    import("react"),
    import("../demos/index"),
  ]);
  const Demo = (demos as Record<string, React.ComponentType>)[props.demo];
  if (!Demo) {
    el.value!.innerHTML = `<p style="color:red">Demo "${props.demo}" not found.</p>`;
    return;
  }
  root = createRoot(el.value);
  root.render(React.createElement(Demo));
});

onBeforeUnmount(() => {
  root?.unmount();
});
</script>

<template>
  <div class="form-demo-shell">
    <div ref="el" class="form-demo-mount" />
  </div>
</template>

<style scoped>
.form-demo-shell {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.form-demo-mount {
  min-height: 60px;
}
</style>
