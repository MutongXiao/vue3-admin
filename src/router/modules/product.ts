import { type RouteRecordRaw, RouterView } from "vue-router";

const route: RouteRecordRaw = {
	path: "product",
	name: "product",
	component: RouterView,
	meta: {
		title: "商品"
	},
	children: [
		{
			path: "product_list",
			name: "product-list",
			component: () => import("@/views/product/list/index.vue"),
			meta: {
				// 自定义路由元数据
				title: "商品列表"
			}
		},
		{
			path: "product_classify",
			name: "product-classify",
			component: () => import("@/views/product/classify/index.vue"),
			meta: {
				title: "商品分类"
			}
		},
		{
			path: "product_attr",
			name: "product-attr",
			component: () => import("@/views/product/attr/index.vue"),
			meta: {
				title: "商品规格"
			}
		},
		{
			path: "product_reply",
			name: "product-reply",
			component: () => import("@/views/product/reply/index.vue"),
			meta: {
				title: "商品评论"
			}
		},
		{
			path: "add_product",
			name: "add-product",
			component: () => import("@/views/product/add/index.vue"),
			meta: {
				title: "添加商品"
			}
		}
	]
};

export default route;
