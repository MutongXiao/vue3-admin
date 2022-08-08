<template>
	<el-container>
		<el-aside>
			<AppMenu />
		</el-aside>

		<el-container>
			<el-header>
				<AppHeader />
			</el-header>

			<el-main>
				<!-- 子路由出口 -->
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script lang="ts" setup>
import AppMenu from "./AppMenu/index.vue";
import AppHeader from "./AppHeader/index.vue";
</script>

<style lang="scss" scoped>
.el-container {
	min-height: 100vh;
}
.el-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: var(--el-text-color-primary);
	background-color: #ffffff;
}
.el-aside {
	width: auto;
	color: var(--el-text-color-primary);
	background-color: #1b72dc;
}
.el-main {
	color: var(--el-text-color-primary);
	background-color: #e9eef3;
}
</style>
