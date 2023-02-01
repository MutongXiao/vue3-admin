export interface IProps {
	// 画布宽度
	width?: number;
	// 画布高度
	height?: number;
	// 线宽
	lineWidth?: number;
	// 线段颜色
	strokeColor?: string;
	// 设置线条两端圆角
	lineCap?: CanvasLineCap;
	// 线条交汇处圆角
	lineJoin?: CanvasLineJoin;
	// 画布背景颜色
	bgColor?: string;
	// 是否显示按钮
	showBtn?: boolean;
	// 当保存时的回调, blob为生成的图片bob
	onSave?: (blob: Blob) => void;
	// 当画布清空时的回调, 参数为画布的上下文对象,可以直接使用canvas的api
	onClear?: (canvasContext: CanvasRenderingContext2D) => void;
	// 当画布结束时的回调
	onDrawEnd?: (canvas: HTMLCanvasElement) => void;
}
