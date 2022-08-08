<template>
	<el-dropdown trigger="click">
		<span>
			<el-tooltip effect="dark" content="组件大小" placement="bottom">
				<i :class="'iconfont icon-contentright'" class="icon-style"></i>
			</el-tooltip>
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item> 大 </el-dropdown-item>
				<el-dropdown-item> 小 </el-dropdown-item>
				<el-dropdown-item> 中 </el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "../index.scss";
</style>
