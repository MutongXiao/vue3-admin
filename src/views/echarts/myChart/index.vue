<template>
	<div class="box" id="box1"></div>
	<div class="box" id="box2"></div>
	<div class="box" id="box3"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import MyCharts from "./charts";

// function setFontSize() {
// 	document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + "px";
// }
onMounted(() => {
	new MyCharts({
		select: "#box1",
		ratio: window.devicePixelRatio,
		type: "cirque"
	});
	new MyCharts({
		select: "#box2",
		ratio: window.devicePixelRatio,
		type: "line",
		data: [
			{
				xVal: "周一",
				yVal: 40
			},
			{
				xVal: "周二",
				yVal: 70
			},
			{
				xVal: "周三",
				yVal: 30
			},
			{
				xVal: "周四",
				yVal: 80
			},
			{
				xVal: "周五",
				yVal: 30
			},
			{
				xVal: "周六",
				yVal: 20
			},
			{
				xVal: "周日",
				yVal: 90
			}
		]
	});
	new MyCharts({
		type: "histogram",
		select: "#box3",
		ratio: 1.5,
		data: [
			{
				xVal: "vue",
				yVal: 80
			},
			{
				xVal: "react",
				yVal: 70
			},
			{
				xVal: "angular",
				yVal: 40
			},
			{
				xVal: "webpack",
				yVal: 90
			},
			{
				xVal: "2222",
				yVal: 80
			},
			{
				xVal: "typescript",
				yVal: 40
			},
			{
				xVal: "ES6+",
				yVal: 100
			}
		]
	});
	// setFontSize();
	// window.addEventListener("resize", setFontSize);
});
onUnmounted(() => {
	// window.removeEventListener("resize", setFontSize);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
