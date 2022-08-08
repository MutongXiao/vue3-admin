import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

import AppLayout from "@/layout/AppLayout.vue";
import productRoute from "./modules/product";
import orderRoute from "./modules/order";
import permissionRoute from "./modules/permission";
import mediaRoute from "./modules/media";
import settingRoute from "./modules/setting";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		component: AppLayout,
		children: [
			{
				path: "",
				name: "home",
				meta: {
					title: "首页"
				},
				component: () => import("@/views/home/index.vue")
			},
			productRoute,
			orderRoute,
			permissionRoute,
			mediaRoute,
			settingRoute
		]
	},
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/login/index.vue")
	}
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

router.beforeEach(() => {
	nprogress.start();
});

router.afterEach(() => {
	nprogress.done();
});

export default router;
