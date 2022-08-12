// 加载全局样式
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// custom element dark(自定义暗黑模式)
import "@/styles/element-dark.scss";
// custom element css
import "@/styles/element.scss";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// font css
import "@/assets/fonts/font.scss";
// element css
import "element-plus/dist/index.css";
// element dark(内置暗黑模式)
import "element-plus/theme-chalk/dark/css-vars.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// 全局导入注册 element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// vue i18n
import I18n from "@/language/index";
// svg icons
import "virtual:svg-icons-register";
// pinia store
import pinia from "@/store/index";

const app = createApp(App);
// 注册element Icons组件
Object.keys(Icons).forEach(key => {
	app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(router).use(I18n).use(pinia).use(ElementPlus);
app.mount("#app");
