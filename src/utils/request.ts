import axios, { type AxiosRequestConfig } from "axios";

const request = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 30000,
	withCredentials: false
});

// 请求拦截器
request.interceptors.request.use(
	function (config) {
		console.log("config", config);
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

// 响应拦截器
request.interceptors.response.use(
	function (response) {
		console.log("response", response);
		return response;
	},
	function (error) {
		console.log("error", error);
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	}
);

export default async <T = any>(config: AxiosRequestConfig) => {
	const res = await request(config);
	return (res.data.data || res.data) as T;
};
