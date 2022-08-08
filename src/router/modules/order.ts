import { RouterView, type RouteRecordRaw } from "vue-router";

const route: RouteRecordRaw = {
	path: "order",
	name: "order",
	component: RouterView,
	meta: {
		title: "订单"
	},
	children: [
		{
			path: "order_list",
			name: "order-list",
			component: () => import("@/views/order/list/index.vue"),
			meta: {
				title: "订单列表"
			}
		},
		{
			path: "order_offline",
			name: "order-offline",
			component: () => import("@/views/order/offline/index.vue"),
			meta: {
				title: "订单线下"
			}
		}
	]
};

export default route;
