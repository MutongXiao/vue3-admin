import type { App, Directive } from "vue";

import copy from "./copy";
import debounce from "./debounce";
import throttle from "./throttle";
import draggable from "./draggable";
import waterMarker from "./waterMarker";
import longpress from "./longpress";

const directivesList: Record<string, Directive> = {
	// Custom directives
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
