<template>
	<div class="canvas-demo">
		<button @click.once="makeWorker">开始绘图</button>
		<canvas ref="htmlCanvas" id="myCanvas" width="300" height="150"></canvas>
	</div>
</template>

<script setup lang="ts">
const canvasWorker = new Worker(new URL("../worker/canvasWorker.js", import.meta.url));
function makeWorker() {
	const htmlCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
	// 使用canvas的transferControlToOffscreen函数获取一个OffscreenCanvas对象
	const offscreen = htmlCanvas.transferControlToOffscreen();
	// 注意：第二个参数不能省略
	canvasWorker.postMessage({ canvas: offscreen }, [offscreen]);
}
</script>

<style scoped>
.canvas-demo {
	padding: 20px;
}
</style>
