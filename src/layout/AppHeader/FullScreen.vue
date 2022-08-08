<template>
	<el-icon @click="toggleFullScreen"><ScreenToggleIcon /></el-icon>
</template>

<script setup lang="ts">
import { FullScreen, Crop } from "@element-plus/icons-vue";
import useStore from "@/stores";
import { storeToRefs } from "pinia";

const store = useStore();
const { isFullScreen } = storeToRefs(store);

const ScreenToggleIcon = computed(() => {
	return isFullScreen.value ? Crop : FullScreen;
});

const toggleFullScreen = () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
};

document.onfullscreenchange = function () {
	if (!document.fullscreenElement) {
		isFullScreen.value = false;
	} else {
		isFullScreen.value = true;
	}
};
</script>

<style scoped></style>
