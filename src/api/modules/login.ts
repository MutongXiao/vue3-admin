import type { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
//import qs from "qs";

//import Menu from "@/assets/json/menu.json";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
	// 正常 post json 请求  ==>  application/json
	return http.post<Login.ResLogin>(PORT1 + `/login`, params);
	// post 请求携带 query 参数  ==>  ?username=admin&password=123456
	// return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params });
	// post 请求携带 表单 参数  ==>  application/x-www-form-urlencoded
	// return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params));
	// 控制当前请求不显示 loading
	// return http.post<Login.ResLogin>(PORT1 + `/login`, params, { headers: { noLoading: true } });
	// 如果是 get 请求可以携带数组等复杂参数
	// return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}
};

// * 用户退出登录
export const logoutApi = () => {
	return http.post(PORT1 + `/logout`);
};

// * 获取菜单列表
export const getAuthMenusApi = async () => {
	return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
	// 如果想让菜单变为本地数据，注释上一行代码，并引入本地 Menu.json 数据
	// const res = await new Promise<typeof Menu>(resolve => {
	// 	setTimeout(() => {
	// 		resolve(Menu);
	// 	}, 1000);
	// });
	// return res;
};

// * 获取按钮权限
export const getAuthButtonsApi = () => {
	return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
};
