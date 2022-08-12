import type { RouteRecordRaw } from "vue-router";
import { Layout } from "@/router/constant";

// 首页模块
const homeRoute: Array<RouteRecordRaw> = [
	{
		path: "/homw",
		component: Layout,
		redirect: "/home/index",
		children: [
			{
				path: "/home/index",
				name: "home",
				component: () => import("@/views/home/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "首页",
					key: "home"
				}
			}
		]
	}
];

export default homeRoute;
