/**
 * v-auth
 * 按钮权限指令
 */
import { AuthStore } from "@/store/modules/auth";
import type { Directive, DirectiveBinding } from "vue";

const auth: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const { value } = binding;
		const authStore = AuthStore();
		const currentPageRoles = authStore.authButtonList[authStore.routeName] ?? {};
		if (value instanceof Array && value.length) {
			const hasPermission = value.every(item => currentPageRoles[item]);
			if (!hasPermission) el.remove();
		}
	}
};

export default auth;
