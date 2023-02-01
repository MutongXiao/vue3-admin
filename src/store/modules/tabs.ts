import { defineStore } from "pinia";
import type { TabsState, TabsMenuProps } from "@/store/interface";
import { TABS_WHITE_LIST } from "@/config/config";
import piniaPersistConfig from "@/config/piniaPersist";
import router from "@/router/index";

// TabsStore
export const TabsStore = defineStore({
	id: "TabsState",
	state: (): TabsState => ({
		tabsMenuList: []
	}),
	getters: {},
	actions: {
		// Add Tabs
		async addTabs(tabItem: TabsMenuProps) {
			// not add tabs white list
			if (TABS_WHITE_LIST.includes(tabItem.path)) return;
			if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
				this.tabsMenuList.push(tabItem);
			}
		},
		// set tab title
		async setTabsTitle(title: string) {
			const currentPath = location.hash.substring(1);
			this.tabsMenuList.forEach(tab => {
				if (tab.path === currentPath) tab.title = title;
			});
		},
		// Remove Tabs
		async removeTabs(tabPath: string, isCurrent: boolean = true) {
			const tabsMenuList = this.tabsMenuList;
			if (isCurrent) {
				tabsMenuList.forEach((item, index) => {
					if (item.path !== tabPath) return;
					const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
					if (!nextTab) return;
					router.push(nextTab.path);
				});
			}
			this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
		},
		// Close MultipleTab
		async closeMultipleTab(tabsMenuValue?: string) {
			this.tabsMenuList = this.tabsMenuList.filter(item => {
				return item.path === tabsMenuValue || !item.close;
			});
		}
	},
	persist: piniaPersistConfig("TabsState")
});
