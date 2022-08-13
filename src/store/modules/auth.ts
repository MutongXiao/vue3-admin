import { defineStore } from "pinia";
import type { AuthState } from "../interface";
import piniaPersistConfig from "@/config/piniaPersist";

// AuthStore
export const AuthStore = defineStore("AuthStore", {
	// id: "AuthStore",
	state: (): AuthState => ({
		// 用户按钮权限列表
		authButtons: {},
		// 路由权限列表
		authRouters: []
	}),
	getters: {
		// 处理权限按钮数据，用于方便控制按钮
		authButtonsObj: state => {
			return state.authButtons;
		},
		// 后台返回的菜单数据，用于方便控制路由跳转时权限（这里已经处理成一维数组了）
		dynamicRouters: state => {
			return state.authRouters;
		}
	},
	actions: {
		// setAuthButtons
		async setAuthButtons(auhtButtonList: Record<string, any>) {
			this.authButtons = auhtButtonList;
		},
		// setAuthRouter
		async setAuthRouters(dynamicRouters: string[]) {
			this.authRouters = dynamicRouters;
		}
	},
	persist: piniaPersistConfig("AuthState")
});
