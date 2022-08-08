import { type RouteRecordRaw, RouterView } from "vue-router";

const route: RouteRecordRaw = {
	path: "setting",
	name: "setting",
	component: RouterView,
	meta: {
		title: "设置"
	},
	children: [
		{
			path: "permission",
			name: "setting-permission",
			component: RouterView,
			meta: {
				title: "权限管理"
			},
			children: [
				{
					path: "admin",
					name: "setting-permission-admin",
					component: () => import("@/views/setting/permission/admin/index.vue"),
					meta: {
						title: "管理员"
					}
				},
				{
					path: "role",
					name: "setting-permission-role",
					component: () => import("@/views/setting/permission/role/index.vue"),
					meta: {
						title: "角色"
					}
				},
				{
					path: "rule",
					name: "setting-permission-rule",
					component: () => import("@/views/setting/permission/rule/index.vue"),
					meta: {
						title: "规则"
					}
				}
			]
		}
	]
};

export default route;
