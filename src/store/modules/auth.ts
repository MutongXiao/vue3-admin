import { defineStore } from "pinia";
import type { AuthState } from "../interface";
import { getFlatArr } from "@/utils/util";
import { getAuthButtonsApi, getAuthMenusApi } from "@/api/modules/login";
import { getKeepAliveRouterName, getShowMenuList, getAllBreadcrumbList } from "@/utils/util";
import piniaPersistConfig from "@/config/piniaPersist";

// AuthStore
export const AuthStore = defineStore("AuthStore", {
	// id: "AuthStore",
	state: (): AuthState => ({
		// 当前页面的 router name，用来做按钮权限筛选
		routeName: "",
		// 按钮权限列表
		authButtonList: {},
		// menuList 作为动态路由，不会做持久化存储
		authMenuList: []
	}),
	getters: {
		// 按钮权限列表
		// authButtonList: state => state.authButtonList,
		// 后端返回的菜单列表 ==> 这里没有经过任何处理
		// authMenuList: state => state.authMenuList,
		// 后端返回的菜单列表 ==> 左侧菜单栏渲染，需要去除 isHide == true
		showMenuList: state => getShowMenuList(state.authMenuList),
		// 扁平化之后的一维数组路由，主要用来添加动态路由
		flatMenuList: state => getFlatArr(state.authMenuList),
		// 所有面包屑导航列表
		breadcrumbList: state => getAllBreadcrumbList(state.authMenuList),
		// 需要缓存的菜单 name，用作页面 keepAlive
		keepAliveRouter: state => getKeepAliveRouterName(state.authMenuList)
	},
	actions: {
		// 从接口api获取权限列表
		async getAuthButtonList() {
			const { data } = await getAuthButtonsApi();
			this.authButtonList = data;
		},
		// 从接口api获取菜单列表
		async getAuthMenuList() {
			const { data } = await getAuthMenusApi();
			this.authMenuList = data;
		},
		// setRouteName
		async setRouteName(name: string) {
			this.routeName = name;
		}
	},
	persist: piniaPersistConfig("AuthState", ["routeName", "authButtonList"])
});
