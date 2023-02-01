<template>
	<div class="xi-sign-wrap" :style="{ width: props.width, height: props.height }">
		<el-alert title="在下方书写签名 ⬇" type="info" :closable="false" />
		<canvas ref="canvasRef"></canvas>
		<div v-if="props.showBtn" class="xi-sign-btnWrap">
			<span @click="cancel" class="xi-sign-btn">清除</span>
			<span @click="save" class="xi-sign-btn primary">保存</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
// vue3 尚不支持从外部引入类型定义
// import type { IProps } from "./type";

interface IProps {
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
const props = withDefaults(defineProps<IProps>(), {
	width: 400,
	height: 200,
	lineWidth: 4,
	strokeColor: "green",
	lineCap: "round",
	lineJoin: "round",
	bgColor: "transparent",
	showBtn: true
});

const canvasRef = ref<HTMLCanvasElement>();
let ctxRef: CanvasRenderingContext2D | null = null;

// 取消-清空画布
const cancel = () => {
	// 清空当前画布上的所有绘制内容
	if (ctxRef) {
		ctxRef.clearRect(0, 0, props.width, props.height);
		props.onClear && props.onClear(ctxRef);
	}
};

// 保存-将画布内容保存为图片
const save = () => {
	if (!canvasRef.value) return;
	// 将canvas上的内容转成blob流
	canvasRef.value.toBlob((blob: any) => {
		// 获取当前时间并转成字符串，用来当做文件名
		const date = Date.now().toString();
		// 创建一个 a 标签
		const a = document.createElement("a");
		// 设置 a 标签的下载文件名
		a.download = `${date}.png`;
		// 设置 a 标签的跳转路径为 文件流地址
		a.href = URL.createObjectURL(blob);
		// 手动触发 a 标签的点击事件
		a.click();
		// 移除 a 标签
		a.remove();

		props.onSave && props.onSave(blob);
	});
};

const canvasParams = {
	// 保存上次绘制的 坐标及偏移量
	client: {
		endX: 0, // 坐标
		endY: 0
	},
	// 判断是否为移动端
	mobileStatus: /Mobile|Android|iPhone/i.test(navigator.userAgent)
};

const initCanvasConfig = () => {
	// 获取canvas 实例
	const canvas = canvasRef.value;
	if (!canvas) return;

	// 设置宽高
	canvas.width = props.width;
	canvas.height = props.height;

	// 创建上下文
	if (!ctxRef) {
		ctxRef = canvas.getContext("2d")!;
	}
	ctxRef.clearRect(0, 0, props.width, props.height);
	// 设置填充背景色
	ctxRef.fillStyle = props.bgColor;
	// 绘制填充矩形
	ctxRef.fillRect(
		0, // x 轴起始绘制位置
		0, // y 轴起始绘制位置
		props.width, // 宽度
		props.height // 高度
	);
};

// 鼠标按下
const pointerDown = (event: Event) => {
	if (!canvasRef.value || !ctxRef) return;

	const { client, mobileStatus } = canvasParams;
	const { x, y } = canvasRef.value.getBoundingClientRect();
	// 获取偏移量及坐标
	const { pageX, pageY } = mobileStatus ? (event as TouchEvent).changedTouches[0] : (event as MouseEvent);
	// 修改鼠标落点坐标
	client.endX = pageX;
	client.endY = pageY;

	// 清除以上一次 beginPath 之后的所有路径，进行绘制
	ctxRef.beginPath();
	// 根据配置文件设置相应配置
	ctxRef.lineWidth = props.lineWidth;
	ctxRef.strokeStyle = props.strokeColor;
	ctxRef.lineCap = props.lineCap;
	ctxRef.lineJoin = props.lineJoin;
	// 设置画线起始点位
	ctxRef.moveTo(client.endX - x, client.endY - y);
	// 监听 鼠标移动或手势移动
	canvasRef.value!.addEventListener(mobileStatus ? "touchmove" : "mousemove", draw);
};
// 绘制
const draw = (event: Event) => {
	if (!canvasRef.value || !ctxRef) return;

	const { client, mobileStatus } = canvasParams;
	// 获取当前坐标点位
	const { pageX, pageY } = mobileStatus ? (event as TouchEvent).changedTouches[0] : (event as MouseEvent);
	const { x, y } = canvasRef.value.getBoundingClientRect();

	// 修改最后一次绘制的坐标点
	client.endX = pageX;
	client.endY = pageY;

	// 根据坐标点位移动添加线条
	ctxRef.lineTo(pageX - x, pageY - y);

	// 绘制
	ctxRef.stroke();
};
// 结束绘制
const closeDraw = () => {
	if (!canvasRef.value || !ctxRef) return;
	// 结束绘制
	ctxRef.closePath();
	// 移除鼠标移动或手势移动监听器
	canvasRef.value.removeEventListener("mousemove", draw);
	props.onDrawEnd && props.onDrawEnd(canvasRef.value);
};

onMounted(() => {
	const { mobileStatus } = canvasParams;
	initCanvasConfig();
	// 创建鼠标/手势按下监听器
	canvasRef.value!.addEventListener(mobileStatus ? "touchstart" : "mousedown", pointerDown);
	// 创建鼠标/手势 弹起/离开 监听器
	canvasRef.value!.addEventListener(mobileStatus ? "touchend" : "mouseup", closeDraw);
});

watch(props, () => {
	initCanvasConfig();
});
</script>

<style scoped lang="scss">
.xi-sign-wrap {
	border: 1px solid #cccccc;
	.xi-sign-btnWrap {
		margin-top: 10px;
		.xi-sign-btn {
			display: inline-block;
			padding: 4px 12px;
			margin-right: 12px;
			font-size: 14px;
			cursor: pointer;
			background-color: #cccccc;
			border-radius: 6px;
			&.primary {
				color: #ffffff;
				background-color: #1677ff;
			}
		}
	}
}
</style>
