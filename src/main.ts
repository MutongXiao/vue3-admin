// 加载全局样式
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// custom element dark(自定义暗黑模式)
import "@/styles/theme/element-dark.scss";
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
// 全局导入注册 element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// vue i18n
import I18n from "@/language/index";
// svg icons
import "virtual:svg-icons-register";
// router
import router from "./router";
// pinia store
import pinia from "@/store/index";
// custom directives
import directives from "@/directives/index";
// vxe-table 按需引入
import useVxeTable from "./views/awesomeModules/webWorker/demo/useTable";
// errorHandler
import errorHandler from "@/utils/errorHandler";
//引入oh-vue-icons,参考 https://oh-vue-icons.js.org/zh/docs
import { OhVueIcon, addIcons } from "oh-vue-icons";
// 这里引入你需要的图标
import {
	FcFolder,
	ViFileTypeWord,
	ViFileTypeExcel,
	ViFileTypePowerpoint,
	ViFileTypePdf,
	ViFileTypeImage,
	ViFileTypeVideo,
	ViFileTypeAudio,
	ViFileTypePhotoshop2,
	ViFileTypeText,
	ViDefaultFile,
	ViFileTypeJson
} from "oh-vue-icons/icons";

addIcons(
	FcFolder,
	ViFileTypeWord,
	ViFileTypeExcel,
	ViFileTypePowerpoint,
	ViFileTypePdf,
	ViFileTypeImage,
	ViFileTypeVideo,
	ViFileTypeAudio,
	ViFileTypePhotoshop2,
	ViFileTypeText,
	ViDefaultFile,
	ViFileTypeJson
);

const app = createApp(App);

app.config.errorHandler = errorHandler;

// 注册element Icons组件
Object.keys(Icons).forEach(key => {
	app.component(key, Icons[key as keyof typeof Icons]);
});
// 注册 VIcon 组件
app.component("VIcon", OhVueIcon);

app.use(router).use(I18n).use(pinia).use(ElementPlus).use(directives).use(useVxeTable).mount("#app");
