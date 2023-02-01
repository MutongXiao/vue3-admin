<template>
	<Editor v-slot="{ config }" :init-value="initValue">
		<Sign v-bind="config" />
	</Editor>
</template>

<script setup lang="ts">
import Editor from "./editor/index.vue";
import Sign from "./sign/index.vue";
const initValue = {
	width: 400,
	height: 200,
	lineWidth: 4,
	strokeColor: "red",
	lineCap: "round",
	lineJoin: "round",
	bgColor: "transparent",
	showBtn: true
};
</script>

<style scoped></style>
