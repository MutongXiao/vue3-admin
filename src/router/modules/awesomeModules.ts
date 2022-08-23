import type { RouteRecordRaw } from "vue-router";
import { Layout } from "@/router/constant";

const assemblyRouter: Array<RouteRecordRaw> = [
	{
		path: "/awesomeModules",
		component: Layout,
		redirect: "/awesomeModules/todolist",
		meta: {
			title: "vue3 实践"
		},
		children: [
			{
				path: "/awesomeModules/todolist",
				name: "todolist",
				component: () => import("@/views/awesomeModules/todoList/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: false,
					title: "todolist",
					key: "todolist"
				}
			},
			{
				path: "/awesomeModules/painHeatMap",
				name: "painHeatMap",
				component: () => import("@/views/awesomeModules/painHeatMap/index.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: false,
					title: "图片局部流动",
					key: "painHeatMap"
				}
			}
		]
	}
];

export default assemblyRouter;
