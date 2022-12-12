import type { App, Directive } from "vue";
import auth from "./modules/auth";
import copy from "./modules/copy";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import draggable from "./modules/draggable";
import waterMarker from "./modules/waterMarker";
import longpress from "./modules/longpress";

const directivesList: Record<string, Directive> = {
	// Custom directives
	auth,
	copy,
	debounce,
	draggable,
	throttle,
	waterMarker,
	longpress
};

// 以插件的形式对外暴露，在main中以插件的形式全局注册指令
const directives = {
	install: function (app: App<Element>) {
		Reflect.ownKeys(directivesList).forEach(key => {
			// 注册所有自定义指令
			app.directive(key as string, directivesList[key as string]);
		});
	}
};

export default directives;
