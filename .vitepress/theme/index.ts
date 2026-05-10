import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import "./custom.css";
import FormDemo from "./FormDemo.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("FormDemo", FormDemo);
  },
};
