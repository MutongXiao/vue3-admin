import type { RouteRecordRaw } from "vue-router";
import { Layout } from "@/router/constant";

// echarts 模块
const echartsRouter: Array<RouteRecordRaw> = [
	{
		path: "/echarts",
		component: Layout,
		redirect: "/echarts/waterChart",
		meta: {
			title: "echarts"
		},
		children: [
			{
				path: "/echarts/waterChart",
				name: "waterChart",
				component: () => import("@/views/echarts/waterChart/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "水型图",
					key: "waterChart"
				}
			},
			{
				path: "/echarts/columnChart",
				name: "columnChart",
				component: () => import("@/views/echarts/columnChart/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "柱状图",
					key: "columnChart"
				}
			},
			{
				path: "/echarts/lineChart",
				name: "lineChart",
				component: () => import("@/views/echarts/lineChart/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "折线图",
					key: "lineChart"
				}
			},
			{
				path: "/echarts/pieChart",
				name: "pieChart",
				component: () => import("@/views/echarts/pieChart/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "饼图",
					key: "pieChart"
				}
			},
			{
				path: "/echarts/radarChart",
				name: "radarChart",
				component: () => import("@/views/echarts/radarChart/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "雷达图",
					key: "radarChart"
				}
			},
			{
				path: "/echarts/nestedChart",
				name: "nestedChart",
				component: () => import("@/views/echarts/nestedChart/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "嵌套环形图",
					key: "nestedChart"
				}
			},
			{
				path: "/echarts/myCharts",
				name: "myCharts",
				component: () => import("@/views/echarts/myChart/index.vue"),
				meta: {
					notransition: true,
					keepAlive: false,
					requiresAuth: true,
					title: "canvas原生绘制",
					key: "myCharts"
				}
			}
		]
	}
];

export default echartsRouter;
