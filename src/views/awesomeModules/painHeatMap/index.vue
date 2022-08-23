<template>
	<div class="content-box">
		<!-- <section class="bg"></section> -->
		<h2 class="title">使用前端技术实现静态图片局部流动效果 🌊</h2>
		<p class="title">鼠标按下并移动绘制流动路径</p>
		<main id="sketch">
			<canvas id="canvas" data-img=""></canvas>
			<div class="mask heatmap-div">
				<div id="maskInner" class="mask-inner heatmap-div"></div>
			</div>
		</main>
		<section class="button_container">
			<button class="button">清除画布</button>
			<button class="button"><input class="input" type="file" id="upload" />切换图片</button>
		</section>
		<svg xlmns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
			<filter id="heat" filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%">
				<feTurbulence id="heatturb" type="fractalNoise" numOctaves="1" seed="2" />
				<feDisplacementMap xChannelSelector="G" yChannelSelector="B" scale="22" in="SourceGraphic" />
			</filter>
		</svg>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import gsap from "gsap";

onMounted(() => {
	const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
	const sketch = document.getElementById("sketch")!;
	const ctx = canvas.getContext("2d")!;
	const sketchStyle = window.getComputedStyle(sketch);
	const mouse = { x: 0, y: 0 };
	// 画布大小设置
	canvas.width = parseInt(sketchStyle.getPropertyValue("width"));
	canvas.height = parseInt(sketchStyle.getPropertyValue("height"));
	// 画笔设置
	ctx.lineWidth = 40;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.strokeStyle = "black";
	// 将画布绘制的内容转url,设置到指定元素的css mask-images 属性上
	const onPaint = () => {
		ctx.lineTo(mouse.x, mouse.y);
		ctx.stroke();
		const url = canvas.toDataURL();
		document.querySelectorAll<HTMLDivElement>(".heatmap-div").forEach(item => {
			item.style.cssText += `
      display: initial;
      -webkit-mask-image: url(${url});
      mask-image: url(${url});
    `;
		});
	};

	// 获取鼠标在画布中的位置
	canvas.addEventListener(
		"mousemove",
		e => {
			mouse.x = e.pageX - canvas.getBoundingClientRect().left;
			mouse.y = e.pageY - canvas.getBoundingClientRect().top;
		},
		false
	);

	// 鼠标按下开始绘制
	canvas.addEventListener(
		"mousedown",
		() => {
			ctx.beginPath();
			ctx.moveTo(mouse.x, mouse.y);
			canvas.addEventListener("mousemove", onPaint, false);
		},
		false
	);

	// 鼠标抬起
	canvas.addEventListener(
		"mouseup",
		() => {
			canvas.removeEventListener("mousemove", onPaint, false);
		},
		false
	);

	document.querySelectorAll<HTMLDivElement>(".heatmap-div").forEach(item => {
		item.style.cssText += `
    display: initial;
  `;
	});

	const timeline = gsap.timeline({
		repeat: -1,
		yoyo: true
	});

	const feTurb = document.querySelector("#heatturb")!;
	timeline.add(
		gsap.to(feTurb, 8, {
			onUpdate: function () {
				const bfX = this.progress() * 0.01 + 0.025,
					bfY = this.progress() * 0.003 + 0.01,
					bfStr = bfX.toString() + " " + bfY.toString();
				feTurb.setAttribute("baseFrequency", bfStr);
			}
		}),
		0
	);

	function clear() {
		document.querySelectorAll<HTMLDivElement>(".heatmap-div").forEach(item => {
			item.style.cssText += `
      display: none;
      -webkit-mask-image: none;
      mask-image: none;
    `;
		});
	}

	document.querySelectorAll(".button").forEach(item => {
		item.addEventListener("click", () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			clear();
		});
	});

	document.getElementById("upload")!.onchange = function (payload: any) {
		const imageFile = payload.target.files[0];
		const newImg = window.URL.createObjectURL(imageFile);
		clear();
		sketch.style.cssText += `
    background: url(${newImg});
    background-size: cover;
    background-position: center;
  `;
		document.getElementById("maskInner")!.style.cssText += `
    background: url(${newImg});
    background-size: cover;
    background-position: center;
  `;
	};
});
</script>

<style scoped>
@import "./index.scss";
</style>
