<template>
	<el-space size="large">
		<ToggleSidebar />
		<Breadcrumb />
	</el-space>
	<el-space size="large">
		<FullScreen />
	</el-space>
</template>
<script lang="ts" setup>
import ToggleSidebar from "./ToggleSidebar.vue";
import Breadcrumb from "./Breadcrumb.vue";
import FullScreen from "./FullScreen.vue";
</script>
