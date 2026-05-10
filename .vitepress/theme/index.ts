import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import "./tailwind.css";
import "./custom.css";
import FormDemo from "./FormDemo.vue";
import FormDemoTabs from "./components/FormDemoTabs.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    // Legacy bare-preview component — kept for backward compatibility
    app.component("FormDemo", FormDemo);
    // New tabbed Preview + Code component
    app.component("FormDemoTabs", FormDemoTabs);
  },
};
