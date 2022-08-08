<script setup lang="ts">
import { RouterView } from "vue-router";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
</script>

<template>
	<ElConfigProvider :locale="zhCn">
		<RouterView />
	</ElConfigProvider>
</template>

<style scoped></style>
