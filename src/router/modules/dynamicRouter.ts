import router from "@/router/index";
import { isType } from "@/utils/util";
import { LOGIN_URL } from "@/config/config";
import { ElNotification } from "element-plus";
import { GlobalStore } from "@/store";
import { AuthStore } from "@/store/modules/auth";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */
export const initDynamicRouter = async () => {
	const authStore = AuthStore();
	const globalStore = GlobalStore();
	try {
		// 1.获取菜单列表 && 按钮权限（可合并到一个接口获取，根据后端不同可自行改造）
		await authStore.getAuthMenuList();
		await authStore.getAuthButtonList();

		// 2.判断当前用户有没有任何菜单权限
		if (!authStore.authMenuList.length) {
			ElNotification({
				title: "无权限访问",
				message: "当前账号无任何菜单权限，请联系系统管理员！",
				type: "warning",
				duration: 3000
			});
			globalStore.setToken("");
			router.replace(LOGIN_URL);
			return Promise.reject("No permission");
		}

		// 3.添加动态路由
		authStore.flatMenuList.forEach((item: any) => {
			item.children && delete item.children;
			if (item.component && isType(item.component) == "string") {
				item.component = modules["/src/views" + item.component + ".vue"];
			}
			if (item.meta.isFull) {
				// 全屏显示的路由，不在布局页面中，添加一个新路由节点
				router.addRoute(item);
			} else {
				// 在 layout 路由节点添加一个新的子路由
				router.addRoute("layout", item);
			}
		});
	} catch (error) {
		// 💢 当按钮 || 菜单请求出错时，重定向到登陆页
		globalStore.setToken("");
		router.replace(LOGIN_URL);
		return Promise.reject(error);
	}
};
