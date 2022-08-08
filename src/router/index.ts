import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

// * 导入所有路由 routes 节点
const metaRoutes = import.meta.globEager("./modules/*.ts");
// * 处理路由表
export const routesArray: RouteRecordRaw[] = [];
Object.keys(metaRoutes).forEach(modKey => {
	const mod = metaRoutes[modKey] as Record<string, RouteRecordRaw[]>;
	routesArray.push(...mod.default);
});

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: { name: "home" },
		meta: {
			requiresAuth: true
		}
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
