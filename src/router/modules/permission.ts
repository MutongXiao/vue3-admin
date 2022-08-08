import { type RouteRecordRaw, RouterView } from "vue-router";

const route: RouteRecordRaw = {
	path: "permission",
	name: "permission",
	component: RouterView,
	meta: {
		title: "权限"
	},
	children: [
		{
			path: "permission_admin",
			name: "permission-admin",
			component: () => import("@/views/permission/admin/index.vue"),
			meta: {
				title: "管理员"
			}
		},
		{
			path: "permission_role",
			name: "permission-role",
			component: () => import("@/views/permission/role/index.vue"),
			meta: {
				title: "角色"
			}
		},
		{
			path: "permission_rule",
			name: "permission-rule",
			component: () => import("@/views/permission/rule/index.vue"),
			meta: {
				title: "规则"
			}
		}
	]
};

export default route;
