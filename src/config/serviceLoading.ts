import { ElLoading } from "element-plus";

/* 全局请求 loading(服务方式调用) */
let loadingInstance: ReturnType<typeof ElLoading.service>;

const startLoading = () => {
	loadingInstance = ElLoading.service({
		fullscreen: true,
		lock: true,
		text: "Loading",
		background: "rgba(0, 0, 0, 0.7)"
	});
};

const endLoading = () => {
	loadingInstance.close();
};

// 那么 showFullScreenLoading() tryHideFullScreenLoading() 要做的事就是将同一时刻的请求合并。
// 声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
// 调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0;
export const showFullScreenLoading = () => {
	// 初始，启动loading
	if (needLoadingRequestCount === 0) {
		startLoading();
	}
	needLoadingRequestCount++;
};

export const tryHideFullScreenLoading = () => {
	// 没有请求，结束返回
	if (needLoadingRequestCount <= 0) return;
	needLoadingRequestCount--;
	// 减 1，等于0 说明接下来已没有请求，结束loading
	if (needLoadingRequestCount === 0) {
		endLoading();
	}
};
