/* themeConfigProp */
export interface ThemeConfigProp {
	primary: string;
	isDark: boolean;
	isGrey: boolean;
	isWeak: boolean;
	breadcrumb: boolean;
	tabs: boolean;
	footer: boolean;
}

/* GlobalState */
export type IAssemblySize = "" | "default" | "small" | "large";
export interface GlobalState {
	token: string;
	userInfo: any;
	assemblySize: IAssemblySize;
	language: string;
	themeConfig: ThemeConfigProp;
}

/* MenuState */
export interface MenuState {
	isCollapse: boolean;
	menuList: Menu.MenuOptions[];
}

/* TabsState */
export interface TabsState {
	tabsMenuValue: string;
	tabsMenuList: Menu.MenuOptions[];
}

/* AuthState */
export interface AuthState {
	authButtons: {
		[propName: string]: any;
	};
	authRouters: string[];
}
