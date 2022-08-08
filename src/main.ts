// 加载全局样式
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// font css
import "@/assets/fonts/font.scss";
// element css
import "element-plus/dist/index.css";
// element dark(内置暗黑模式)
import "element-plus/theme-chalk/dark/css-vars.css";
// custom element dark(自定义暗黑模式)
import "@/styles/element-dark.scss";
// custom element css
import "@/styles/element.scss";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// element icons
import * as Icons from "@element-plus/icons-vue";
// vue i18n
import I18n from "@/language/index";
// pinia store
import pinia from "@/store/index";

const app = createApp(App);
// 注册element Icons组件
Object.keys(Icons).forEach(key => {
	app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(router).use(I18n).use(pinia);
app.mount("#app");
