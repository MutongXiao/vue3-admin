import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// * 从文件系统导入多个模块, 导入所有路由 routes 节点, globEager 已被弃用
// const metaRoutes = import.meta.globEager("./modules/*.ts");
// // * 处理路由表
// export const routesArray: RouteRecordRaw[] = [];
// Object.keys(metaRoutes).forEach(modKey => {
// 	const mod = metaRoutes[modKey] as Record<string, RouteRecordRaw[]>;
// 	routesArray.push(...mod.default);
// });

// glob 匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。
// 如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），
// 你可以传入 { eager: true } 作为第二个参数：
const modules = import.meta.glob("./modules/*.ts", { eager: true });
// * 处理路由表
export const routesArray: RouteRecordRaw[] = [];
Reflect.ownKeys(modules).forEach(modPath => {
	const mod = modules[modPath as string] as Record<string, RouteRecordRaw[]>;
	routesArray.push(...mod.default);
});

/**
 * @description 路由配置简介（💢没有使用动态路由，路由全部配置在本地，需要使用动态路由请自行改造）
 * @param path ==> 路由路径
 * @param name ==> 路由名称
 * @param redirect ==> 路由重定向
 * @param component ==> 路由组件
 * @param meta ==> 路由元信息
 * @param meta.requireAuth ==> 是否需要权限验证
 * @param meta.keepAlive ==> 是否需要缓存该路由
 * @param meta.title ==> 路由标题
 * @param meta.key	==> 路由key,用来匹配按钮权限
 * */
const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: { name: "home" }
	},
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			requiresAuth: false,
			title: "登录页",
			key: "login"
		}
	},
	...routesArray,
	{
		// 找不到路由重定向到404页面
		path: "/:pathMatch(.*)",
		redirect: { name: "404" }
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
	strict: false,
	// 切换页面，滚动到最顶部
	scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
