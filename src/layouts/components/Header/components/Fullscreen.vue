<!-- 头部全屏控制部件 -->
<template>
	<div class="fullscreen">
		<i :class="['iconfont', isFullscreen ? 'icon-suoxiao' : 'icon-fangda']" class="toolBar-icon" @click="toggle"></i>
	</div>
</template>

<script setup lang="ts">
// @vueuse/core是一个包,它有几十个用于常见开发人员用例的解决方案，如跟踪ref更改，
// 检测元素可见性，简化常见 Vue 模式，键盘 / 鼠标输入等。
// 官方地址：https://vueuse.org/functions.html
import { useFullscreen } from "@vueuse/core";
const { toggle, isFullscreen } = useFullscreen();
</script>
