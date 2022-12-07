<template>
	<div
		className="vertifyWrap"
		:style="{
			width: width + 'px',
			display: visible ? '' : 'none'
		}"
		@mousemove="handleDragMove"
		@touchmove="handleDragMove"
		@mouseup="handleDragEnd"
		@touchend="handleDragEnd"
	>
		<!-- 滑块画布区域 -->
		<div className="canvasArea">
			<canvas ref="panelRef" :width="width" :height="height"></canvas>
			<canvas
				ref="dragBlockRef"
				className="block"
				:width="width"
				:height="height"
				@mousedown="handleDragStart"
				@touchstart="handleDragStart"
			></canvas>
		</div>
		<!-- 刷新按钮 -->
		<div className="refreshIcon" :style="{ backgroundImage: `url(${refreshIcon})` }" @click="handleRefresh"></div>
		<!-- 加载中块元素 -->
		<div
			className="loading"
			:style="{
				width: width + 'px',
				height: height + 'px',
				display: isLoading ? '' : 'none'
			}"
		>
			<div className="loadingIcon"></div>
			<span>加载中...</span>
		</div>
		<!-- 滑块滑动操作条 -->
		<div
			:className="sliderClass"
			:style="{
				pointerEvents: isLoading ? 'none' : 'auto',
				width: width + 'px'
			}"
		>
			<div className="sliderMask" :style="{ width: sliderMaskWidth + 'px' }">
				<div
					className="slider"
					:style="{ left: sliderMaskWidth + 'px' }"
					@mousedown="handleDragStart"
					@touchmove="handleDragStart"
				>
					&rarr;
				</div>
			</div>
			<div className="sliderText">{{ textTip }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getRandomNumberByRange, square, sum } from "./tools";
interface VertifyType {
	spliced: boolean; // x方向上的拼接前后误差验证
	verified: boolean; // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
	left: number; // 滑块的移动位置
	destX: number; // 滑块的目标位置
}
interface IProps {
	width?: number;
	visible?: boolean;
	height?: number;
	refreshIcon?: string;
	l?: number;
	r?: number;
	imgUrl?: string;
	text?: string;
	/**
	 * @description   拖拽滑块时的回调, 参数为当前滑块拖拽的距离
	 * @default       (l: number):void => {}
	 */
	onDraw?: (l: number) => {};
	/**
	 * @description   用户的自定义验证逻辑
	 * @default       (arg: VertifyType) => VertifyType
	 */
	onCustomVertify?: (arg: VertifyType) => VertifyType;
	/**
	 * @description   重制刷新前的回调
	 * @default       ():void => {}
	 */
	onBeforeRefresh?: () => void;
	/**
	 * @description   验证成功回调
	 * @default       ():void => {}
	 */
	onSuccess?: VoidFunction;
	/**
	 * @description   验证失败回调
	 * @default       ():void => {}
	 */
	onFail?: VoidFunction;
	/**
	 * @description   刷新时回调
	 * @default       ():void => {}
	 */
	onRefresh?: VoidFunction;
}

const props = withDefaults(defineProps<IProps>(), {
	width: 320,
	visible: true,
	height: 160,
	refreshIcon: "http://cdn.dooring.cn/dr/icon12.png",
	l: 42,
	r: 9,
	imgUrl: "",
	text: ""
});

const isLoading = ref(true);
const sliderClass = ref("sliderContainer");
const sliderMaskWidth = ref(100);
const textTip = ref(props.text);
const panelRef = ref<HTMLCanvasElement>();
const dragBlockRef = ref<HTMLCanvasElement>();
const imgRef = ref<any>(null);
// 拖动时y轴的移动距离
const trailRef = ref<number[]>([]);
// 按下滑动时的开始坐标
const originXRef = ref<number>(0);
const originYRef = ref<number>(0);
// 标记鼠标是否有在对应滑块按下
const isMouseDownRef = ref<boolean>(false);
// 随机位置
const xRef = ref<number>(0);
const yRef = ref<number>(0);
const PI = Math.PI;
const L = props.l + props.r * 2 + 3; // 滑块实际边长

const getRandomImgSrc = () => {
	return props.imgUrl || `https://picsum.photos/id/${getRandomNumberByRange(0, 1084)}/${props.width}/${props.height}`;
};

const createImg = (onload: VoidFunction) => {
	const img = new Image();
	let errorReloadCount = 0;
	img.crossOrigin = "Anonymous";
	(img as any).setSrc = function (src: string) {
		const isIE = window.navigator.userAgent.indexOf("Trident") > -1;
		if (isIE) {
			// IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
			const xhr = new XMLHttpRequest();
			xhr.onloadend = function (e: any) {
				const file = new FileReader(); // FileReader仅支持IE10+
				file.readAsDataURL(e.target.response);
				file.onloadend = function (e) {
					img.src = e.target?.result as string;
				};
			};
			xhr.open("GET", src);
			xhr.responseType = "blob";
			xhr.send();
		} else img.src = src;
	};
	img.onload = onload;
	img.onerror = () => {
		if (errorReloadCount > 10) return;
		(img as any).setSrc(getRandomImgSrc());
		errorReloadCount++;
	};
	(img as any).setSrc(getRandomImgSrc());
	return img;
};

const drawPath = (ctx: CanvasRenderingContext2D, x: number, y: number, operation: "fill" | "clip") => {
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x + props.l / 2, y - props.r + 2, props.r, 0.72 * PI, 2.26 * PI);
	ctx.lineTo(x + props.l, y);
	ctx.arc(x + props.l + props.r - 2, y + props.l / 2, props.r, 1.21 * PI, 2.78 * PI);
	ctx.lineTo(x + props.l, y + props.l);
	ctx.lineTo(x, y + props.l);
	ctx.arc(x + props.r - 2, y + props.l / 2, props.r + 0.4, 2.76 * PI, 1.24 * PI, true);
	ctx.lineTo(x, y);
	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
	ctx.stroke();
	// globalCompositeOperation 属性，它的主要目的是设置如何将一个源（新的）图像绘制到目标（已有）的图像上。
	// 这里之所以设置该属性是为了让镂空的形状不受背景底图的影响并覆盖在背景底图的上方
	ctx.globalCompositeOperation = "destination-over";
	operation === "fill" ? ctx.fill() : ctx.clip();
};

const draw = (img: HTMLImageElement) => {
	if (!panelRef.value || !dragBlockRef.value) return;
	// 镂空块图案
	const canvasCtx = panelRef.value.getContext("2d")!;
	// 滑块填充块图案
	const blockCtx = dragBlockRef.value.getContext("2d")!;
	// 随机位置创建拼图形状
	xRef.value = getRandomNumberByRange(L + 10, props.width - (L + 10));
	yRef.value = getRandomNumberByRange(10 + props.r * 2, props.height - (L + 10));
	drawPath(canvasCtx, xRef.value, yRef.value, "fill");
	drawPath(blockCtx, xRef.value, yRef.value, "clip");
	// 画入图片
	canvasCtx.drawImage(img, 0, 0, props.width, props.height);
	blockCtx.drawImage(img, 0, 0, props.width, props.height);
	// 提取滑块并放到最左边
	const y1 = yRef.value - props.r * 2 - 1;
	// 获取  canvas 画布场景像素数据
	const ImageData = blockCtx?.getImageData(xRef.value - 3, y1, L, L);
	dragBlockRef.value.width = L;
	// 对场景进行像素数据的写入
	blockCtx.putImageData(ImageData, 0, y1);
};

const initImg = () => {
	const img = createImg(() => {
		isLoading.value = false;
		draw(img);
	});
	imgRef.value = img;
};

const reset = () => {
	if (!panelRef.value || !dragBlockRef.value) return;
	const canvasCtx = panelRef.value.getContext("2d")!;
	const blockCtx = dragBlockRef.value.getContext("2d")!;
	// 清空画布
	canvasCtx.clearRect(0, 0, props.width, props.height);
	blockCtx.clearRect(0, 0, props.width, props.height);
	// 重置样式
	sliderMaskWidth.value = 0;
	sliderClass.value = "sliderContainer";
	dragBlockRef.value.width = props.width;
	dragBlockRef.value.style.left = 0 + "px";

	props.onBeforeRefresh && props.onBeforeRefresh();

	// 重新加载图片
	isLoading.value = true;
	imgRef.value.setSrc(getRandomImgSrc());
};

const handleRefresh = () => {
	const { onRefresh } = props;
	reset();
	typeof onRefresh === "function" && onRefresh();
};

const verify = () => {
	const arr = trailRef.value; // 拖动时y轴的移动距离
	const average = arr.reduce(sum) / arr.length;
	const deviations = arr.map(y => y - average);
	const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
	const left = parseInt(dragBlockRef.value!.style.left);
	return {
		spliced: Math.abs(left - xRef.value) < 10,
		verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
		left,
		destX: xRef.value
	};
};

const handleDragStart = (e: any) => {
	originXRef.value = e.clientX || e.touches[0].clientX;
	originYRef.value = e.clientY || e.touches[0].clientY;
	isMouseDownRef.value = true;
};

const handleDragMove = (e: any) => {
	if (!dragBlockRef.value || !isMouseDownRef.value) return false;
	e.preventDefault();
	const eventX = e.clientX || e.touches[0].clientX;
	const eventY = e.clientY || e.touches[0].clientY;
	const moveX = eventX - originXRef.value;
	const moveY = eventY - originYRef.value;
	if (moveX < 0 || moveX + 38 >= props.width) return false;

	sliderMaskWidth.value = moveX;
	const blockLeft = ((props.width - 40 - 20) / (props.width - 40)) * moveX;
	dragBlockRef.value.style.left = blockLeft + "px";

	sliderClass.value = "sliderContainer sliderContainer_active";
	trailRef.value.push(moveY);

	props.onDraw && props.onDraw(blockLeft);
};

const handleDragEnd = (e: any) => {
	if (!isMouseDownRef.value) return false;
	isMouseDownRef.value = false;
	const eventX = e.clientX || e.changedTouches[0].clientX;
	// 点击后没有移动
	if (eventX === originXRef.value) return false;
	sliderClass.value = "sliderContainer";
	const { spliced, verified } = props.onCustomVertify ? props.onCustomVertify(verify()) : verify();
	// 水平方向拼接验证通过
	if (spliced) {
		// y轴方向的滑动验证通过，主要判断是否机器操作
		if (verified) {
			sliderClass.value = "sliderContainer sliderContainer_success";
			typeof props.onSuccess === "function" && props.onSuccess();
		} else {
			sliderClass.value = "sliderContainer sliderContainer_fail";
			textTip.value = "请再试一次";
			reset();
		}
	} else {
		sliderClass.value = "sliderContainer sliderContainer_fail";
		typeof props.onFail === "function" && props.onFail();
		setTimeout(reset.bind(this), 1000);
	}
};

watch(
	() => props.visible,
	() => {
		const { visible } = props;
		if (visible) {
			imgRef.value ? reset() : initImg();
		}
	}
);

onMounted(() => {
	initImg();
});
</script>

<style scoped lang="scss">
.vertifyWrap {
	position: relative;
	margin: 0 auto;
	.block {
		position: absolute;
		top: 0;
		left: 0;
		cursor: grab;
	}
	.block:active {
		cursor: grabbing;
	}
	.refreshIcon {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 30px;
		height: 30px;
		cursor: pointer;
		background-size: 32px;
	}
	.loading {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #45494c;
		background: #edf0f2;
		.loadingIcon {
			width: 32px;
			height: 32px;
			margin-bottom: 10px;
			background: url("http://cdn.dooring.cn/dr/icon12.png");
			background-size: 32px;
			animation: loading-icon-rotate 0.8s linear infinite;
		}
	}
	@keyframes loading-icon-rotate {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.sliderContainer {
		position: relative;
		height: 40px;
		margin-top: 15px;
		line-height: 40px;
		color: #45494c;
		text-align: center;
		background: #f7f9fa;
		border: 1px solid #e4e7eb;
	}
	.sliderMask {
		position: absolute;
		top: 0;
		left: 0;
		height: 40px;
		background: #d1e9fe;
		border: 0 solid #486cd6;
	}
	.slider {
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		font-size: 18px;
		color: #000000;
		text-align: center;
		cursor: grab;
		background: #ffffff;
		box-shadow: 0 0 3px rgb(0 0 0 / 30%);
		transition: background 0.2s linear;
		&:active {
			cursor: grabbing;
		}
		&:hover {
			color: #ffffff;
			background: #486cd6;
		}
	}
	.sliderContainer_active .slider {
		top: -1px;
		height: 38px;
		border: 1px solid #486cd6;
	}
	.sliderContainer_active .sliderMask {
		height: 38px;
		border-width: 1px;
	}
	.sliderContainer_success .slider {
		top: -1px;
		height: 38px;
		background-color: #0ca14a !important;
		border: 1px solid #0db87f;
	}
	.sliderContainer_success .sliderMask {
		height: 38px;
		background-color: #d2f4ef;
		border: 1px solid #0db87f;
	}
	.sliderContainer_fail .slider {
		top: -1px;
		height: 38px;
		background-color: #f57a7a !important;
		border: 1px solid #f57a7a;
	}
	.sliderContainer_fail .sliderMask {
		height: 38px;
		background-color: #fce1e1;
		border: 1px solid #f57a7a;
	}
	.sliderContainer_active .sliderText,
	.sliderContainer_success .sliderText,
	.sliderContainer_fail .sliderText {
		display: none;
	}
}
</style>
