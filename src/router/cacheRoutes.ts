import type { RouteRecordRaw, RouteRecordName } from "vue-router";
import { routesArray } from "@/router/router";

/**
 * @description 使用递归，过滤需可以缓存的路由
 * @param {Array} _routes 所有路由表
 * @param {Array} _cacheRoutes 缓存的路由表
 * @return void
 * */
let cacheRoutes: any[] = [];
const filteKeepAlive = (_routes: RouteRecordRaw[], _cacheRoutes: RouteRecordName[]): void => {
	_routes.filter(route => {
		route.meta?.keepAlive && route.name && _cacheRoutes.push(route.name);
		route.children && route.children.length !== 0 && filteKeepAlive(route.children, _cacheRoutes);
	});
};

filteKeepAlive(routesArray, cacheRoutes);

export default cacheRoutes;
