import Cirque from "./cirque";
import myAnimation from "./myAnimation";
import { drawAxis, drawPoint, drawBrokenLine, drawDashLine } from "./broken";
import utils from "./utils";
import { drawHistogram } from "./histogram";

interface IDefaultParam {
	select: string; //画布容器选择器
	ratio: number; // 画布像比缩放比例
	type: string;
	data?: any[];
}
interface IDefaultConfig extends IDefaultParam {
	styles: {
		borderColor: string;
		lineColor: string;
		pointColor: string;
	};
	data: any[];
	startX: number;
	padding: number;
	fontSize: string;
	wd: number;
	ht: number;
	lineWidth: number;
	hisColor: string[];
	wid?: number;
	animatStep: number;
	maxPoint?: number;
}
interface ICircleConfig extends IDefaultConfig {
	x: number; // 圆点x
	y: number; // 圆点y
	radius: number; // 半径
	startAngle: number; // 起始角度
	endAngle: number; // 终点角度
	arcWidth: number; // 画笔线宽
	target: number; // 环形进度
}

class MyCharts {
	public defaultParam: IDefaultParam;
	private _canvasContainerDom: HTMLElement | null;
	private _canvas: HTMLCanvasElement;
	public containerWidth: number;
	public containerHeight: number;
	public defaultConfig: IDefaultConfig;
	public circleConfig: ICircleConfig | null;
	public ctx: CanvasRenderingContext2D;

	constructor(defaultParam: IDefaultParam) {
		this.defaultParam = defaultParam;
		this._canvasContainerDom = document.querySelector(defaultParam.select);
		if (!this._canvasContainerDom) {
			throw Error("can not find container by selector");
		} else {
			this.containerWidth = this._canvasContainerDom?.clientWidth;
			this.containerHeight = this._canvasContainerDom?.clientHeight;
			this._canvas = document.createElement("canvas");
			// 设置默认配置
			this.defaultConfig = {
				styles: {
					borderColor: "#6b9bb8", // 边框颜色
					lineColor: "#9ec8da", // 线条颜色
					pointColor: "#41627c" // 点杨色
				}, // 画布样式
				data: [], // 图形数据
				startX: 40, // 画布x轴上刻度间距
				padding: 20, // 画布距离容器的内边距
				fontSize: "16px", // 画布字体
				wd: this.containerWidth, // 画布（尺寸）宽度
				ht: this.containerHeight, // 画布（尺寸）高度
				lineWidth: 2, // 线宽
				hisColor: ["#7b8c7c", "#5c968a", "#576d93", "#a0d878", "#337d56", "#c1d0ae", "#93b469", "#bda29a"], // 柱形条颜色
				animatStep: 1, // 动画步长
				// 扩展或者覆盖配置
				...this.defaultParam
			};
			// 圆形图配置
			this.circleConfig = null;
			// 上下文绘制环境
			this.ctx = this._canvas.getContext("2d")!;
			// 缩放画布大小
			this._canvas.width = this.containerWidth;
			this._canvas.height = this.containerHeight;
			// 设置合适 x轴长度
			this.defaultConfig.wid = this._canvas.width - this.defaultConfig.padding;
			// 设置缩放比
			this.defaultConfig.maxPoint = utils.maxData(this.defaultConfig.data) / 0.8;
			// 添加至div容器当中
			this._canvasContainerDom.appendChild(this._canvas);
			this.init();
		}
	}
	init() {
		switch (this.defaultParam.type) {
			case "cirque":
				const circleConfig = {
					x: this._canvas.width / 2, // 圆点x(画布中心的)
					y: this._canvas.height / 2, // 圆点y(画布中心的)
					radius: 200, // 半径
					startAngle: 0, // 起始角度
					endAngle: 2 * Math.PI, // 终点角度
					arcWidth: 18, // 画笔线宽
					target: 50 // 环形进度百分比
				};
				this.circleConfig = { ...this.defaultConfig, ...circleConfig };
				myAnimation.call(this, {
					percent: this.circleConfig.target,
					animatStep: this.circleConfig.animatStep,
					render: current => {
						Cirque.call(this, current / 100);
					}
				});
				break;
			case "line":
				myAnimation.call(this, {
					percent: 200,
					animatStep: 4,
					render: current => {
						// 绘制坐标系
						drawAxis.call(this);
						// 绘制虚线
						drawBrokenLine.call(this, current / 200);
						// 绘制Y轴虚线
						drawDashLine.call(this, current / 200);
						// 绘制圆形
						drawPoint.call(this, current / 200);
					}
				});
				break;
			case "histogram":
				myAnimation.call(this, {
					percent: 100,
					animatStep: 4,
					render: current => {
						// 绘制坐标系
						drawAxis.call(this);
						// 绘制直方图
						drawHistogram.call(this, current / 100);
					}
				});
				break;
			default:
				console.log("无此功能的绘制");
		}
	}
}

export default MyCharts;
