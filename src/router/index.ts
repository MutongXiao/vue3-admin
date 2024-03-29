import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config/config";
import NProgress from "@/config/nprogress";
import { initDynamicRouter } from "@/router/modules/dynamicRouter";
import { errorRouter, staticRouter } from "@/router/modules/staticRouter";
import { GlobalStore } from "@/store";
import { AuthStore } from "@/store/modules/auth";
import { createRouter, createWebHashHistory } from "vue-router";

/**
 * @description 动态路由参数配置简介
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 是否外链
 * @param meta.isHide ==> 是否隐藏
 * @param meta.isFull ==> 是否全屏(示例：数据大屏页面)
 * @param meta.isAffix ==> 是否固定在 tabs nav
 * @param meta.isKeepAlive ==> 是否缓存
 * */
const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRouter],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
	const globalStore = GlobalStore();

	// 1.NProgress 开始
	NProgress.start();

	// 2.动态设置标题
	const title = import.meta.env.VITE_GLOB_APP_TITLE;
	document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

	// 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
	if (to.path.toLocaleLowerCase() === LOGIN_URL) {
		if (globalStore.token) {
			return next(from.fullPath);
		} else {
			resetRouter();
			return next();
		}
	}

	// 4.判断访问页面是否在(静态路由的)路由白名单地址中，如果存在直接放行
	if (ROUTER_WHITE_LIST.includes(to.path)) return next();

	// 5.判断是否有 Token，没有重定向到 login 页面
	if (!globalStore.token) return next({ path: LOGIN_URL, replace: true });

	// 6.如果没有菜单列表，就重新请求获取菜单列表并加载动态路由
	const authStore = AuthStore();
	if (!authStore.authMenuList.length) {
		await initDynamicRouter();
		return next({ ...to, replace: true });
	}

	// 7.存储 routerName 做按钮权限筛选
	authStore.setRouteName(to.name as string);

	// 8.正常访问页面
	next();
});

/**
 * @description 重置路由, 比如退出登陆时需要重置
 * */
export const resetRouter = () => {
	const authStore = AuthStore();
	authStore.flatMenuList.forEach(route => {
		const { name } = route;
		if (name && router.hasRoute(name)) router.removeRoute(name);
	});
};

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done();
	console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done();
});

export default router;
