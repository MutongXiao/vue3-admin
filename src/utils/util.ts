import { isArray } from "@/utils/is";

/**
 * 数组去重
 * @param {Array} arr 要去重的数组
 * @returns Array
 */
export const uniqueArray = (arr: any[]) => [...new Set(arr)];

/**
 * 计算数值数组平均值
 * @param {Array} arr 数值数组
 * @returns Number 平均值
 */
export const average = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length;

/**
 * 计算两日期之间相差的天数
 * @param startDay 开始日期对象
 * @param endDay 结束日期对象
 * @returns Number
 */
export const dayDiff = (startDay: Date, endDay: Date) => Math.ceil(Math.abs(startDay.getTime() - endDay.getTime()) / 86400000);

/**
 * 查询某天是否为工作日
 * @param date 日期对象
 * @returns Boolean
 */
export const isWorkDay = (date: Date) => date.getDay() % 6 !== 0;

/**
 * 获取 url 参数对象, 比如：http://www.xxx.com/search?q=js+md&newwindow=1
 * @param {String} URL url字符串
 * @returns Object
 */
export const getUrlParameters = (URL: string): Record<string, string> =>
	JSON.parse(`{"${decodeURI(URL.split("?")[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);

/**
 * 判断对象是否为空对象{}
 * @param {Object} obj 判断对象
 * @returns Boolean
 */
export const isEmptyObject = (obj: object) => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;

/**
 * 反转字符串
 * @param {String} str 字符串
 * @returns String
 */
export const reverseStr = (str: string) => str.split("").reverse().join("");

/**
 * 生成随机十六进制 颜色值
 * @returns String
 */
export const randomHexColor = () =>
	`#${Math.floor(Math.random() * 0xffffff)
		.toString(16)
		.padEnd(6, "0")}`;

/**
 * RGB转十六进制颜色值
 * @param r 0-255
 * @param g 0-255
 * @param b 0-255
 * @returns String 十六进制颜色值
 */
export const rgbToHex = (r: number, g: number, b: number) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

/**
 * 判断当前选项卡是否在后台
 * @returns Boolean
 */
export const isTabActive = () => !document.hidden;

/**
 * 判断元素是否处于焦点，document.activeElement 属性返回文档中当前获得焦点的元素
 * @param {HTMLElement} el
 * @returns Boolean
 */
export const elementIsInFocus = (el: HTMLElement) => el === document.activeElement;

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export function localGet(key: string) {
	const value = window.localStorage.getItem(key);
	try {
		return JSON.parse(value as string);
	} catch (error) {
		return value;
	}
}

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 * @return void
 */
export function localSet(key: string, value: any) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @return void
 */
export function localRemove(key: string) {
	window.localStorage.removeItem(key);
}

/**
 * @description 清除所有localStorage
 * @return void
 */
export function localClear() {
	window.localStorage.clear();
}

/**
 * @description 对象数组深克隆
 * @param {Object} obj 源对象
 * @return object
 */
export function deepCopy<T>(obj: any): T {
	let newObj: any;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (typeof obj[attr] === "object") {
			newObj[attr] = deepCopy(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export function isType(val: any) {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
	let num = Math.floor(Math.random() * (min - max) + max);
	return num;
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
	let defaultBrowserLang = "";
	if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
		defaultBrowserLang = "zh";
	} else {
		defaultBrowserLang = "en";
	}
	return defaultBrowserLang;
}

/**
 * @description 递归查询当前路由所对应的路由
 * @param {Array} menuList 菜单列表
 * @param {String} path 当前地址
 * @return array
 */
export function getTabPane<T, U>(menuList: any[], path: U): T {
	let result: any;
	for (let item of menuList || []) {
		if (item.path === path) result = item;
		const res = getTabPane(item.children, path);
		if (res) result = res;
	}
	return result;
}

/**
 * @description 使用递归处理路由菜单，生成一维数组
 * @param {Array} menuList 所有菜单列表
 * @param {Array} newArr 菜单的一维数组
 * @return array
 */
export function handleRouter(routerList: Menu.MenuOptions[], newArr: string[] = []) {
	routerList.forEach((item: Menu.MenuOptions) => {
		typeof item === "object" && item.path && newArr.push(item.path);
		item.children && item.children.length && handleRouter(item.children, newArr);
	});
	return newArr;
}

/**
 * @description 扁平化数组对象
 * @param {Array} arr 数组对象
 * @return array
 */
export function getFlatArr(arr: any) {
	return arr.reduce((pre: any, current: any) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description 格式化表格单元格默认值
 * @param {Number} row 行
 * @param {Number} col 列
 * @param {String} callValue 当前单元格值
 * @return string
 * */
export function defaultFormat(row: number, col: any, callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 处理无数据情况
 * @param {String} callValue 需要处理的值
 * @return string
 * */
export function formatValue(callValue: any) {
	// 如果当前值为数组,使用 / 拼接（根据需求自定义）
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description 根据枚举列表查询当需要的数据（如果指定了 label 和 value 的 key值，会自动识别格式化）
 * @param {String} callValue 当前单元格值
 * @param {Array} enumData 枚举列表
 * @param {String} type 过滤类型（目前只有 tag）
 * @return string
 * */
export function filterEnum(callValue: any, enumData: any, searchProps?: { [key: string]: any }, type?: string) {
	const value = searchProps?.value ?? "value";
	const label = searchProps?.label ?? "label";
	let filterData = enumData.find((item: any) => item[value] === callValue);
	if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
	return filterData ? filterData[label] : "--";
}

/**
 * 获取项目中静态资源
 * @param url 资源路径
 */
export function getStaticFile(url: string) {
	return new URL(url, import.meta.url).href;
}
