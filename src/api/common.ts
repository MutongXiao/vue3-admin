import request from "@/utils/request";

interface ICaptchaResult {
	code: string;
	status: number;
}

export const getCaptcha = (data: { height: number; width: number }) => {
	return request<ICaptchaResult>({
		method: "GET",
		url: "/captcha",
		data
	});
};

export const login = (data: { username: string; password: string; captchaId: string; verifyCode: string }) => {
	return request({
		method: "POST",
		url: "/login",
		data
	});
};
