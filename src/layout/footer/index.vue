<template>
	<div class="footer flx-center">
		<a href="http://www.spicyboy.cn/" target="_blank"> {{ year }} © Geeker-Admin By Geeker Technology. </a>
	</div>
</template>
<script lang="ts" setup>
const year = new Date().getFullYear();
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
