import { defineStore } from "pinia";
import type { MenuState } from "../interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const MenuStore = defineStore("MenuState", {
	state: (): MenuState => ({
		// 菜单是否折叠
		isCollapse: false,
		// 菜单列表数据
		menuList: []
	}),
	getters: {},
	actions: {
		async setCollapse() {
			this.isCollapse = !this.isCollapse;
		},
		async setMenuList(menuList: Menu.MenuOptions[]) {
			this.menuList = menuList;
		}
	},
	persist: piniaPersistConfig("MenuState")
});
