<template>
	<div class="content-box">
		<span class="text">防抖指令 🍇🍇🍇🍓🍓🍓</span>
		<el-button type="primary" v-debounce="debounceClick">防抖按钮 (点击事件在0.5秒后执行)</el-button>
	</div>
</template>

<script setup lang="ts" name="debounceDirect">
import { ElMessage } from "element-plus";
const debounceClick = () => {
	ElMessage.success("多次点击,只执行了一次 🍍🍓🍌");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
