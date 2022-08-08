<template>
	<div class="header">
		<div class="header-lf flx-center"></div>
		<div class="header-ri flx-center">
			<div class="header-icon">
				<!-- Assembly size -->
				<AssemblySize id="assemblySize"></AssemblySize>
				<!-- Full screen -->
				<Fullscreen id="fullscreen"></Fullscreen>
			</div>
			<!-- User name -->
			<span class="username">Geeker</span>
			<!-- Avatar -->
			<Avatar></Avatar>
		</div>
	</div>
</template>

<script setup lang="ts">
import Avatar from "./components/Avatar/index.vue";
import Fullscreen from "./components/Fullscreen.vue";
import AssemblySize from "./components/AssemblySize.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
