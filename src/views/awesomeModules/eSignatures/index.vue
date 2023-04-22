<template>
	<!-- 使用默认插槽，并解构出该插槽传递的 props 参数中的 config -->
	<Editor v-slot="{ config }" :init-editor-config="initConfig">
		<Sign v-bind="config" />
	</Editor>
</template>

<script setup lang="ts">
import Editor from "./editor/index.vue";
import Sign from "./sign/index.vue";
const initConfig = {
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
