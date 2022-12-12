<template>
	<div class="theme-setting">
		<i :class="'iconfont icon-zhuti'" class="toolBar-icon" @click="openDrawer"></i>
	</div>
</template>

<script setup lang="ts">
import { mittBus, OPEN_THEMEDRAWER } from "@/utils/mittBus";
const openDrawer = () => {
	mittBus.emit(OPEN_THEMEDRAWER);
};
</script>
