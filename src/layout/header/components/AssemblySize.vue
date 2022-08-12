<template>
	<el-dropdown trigger="click" @command="setAssemblySize">
		<span>
			<el-tooltip effect="dark" content="组件大小" placement="bottom">
				<i :class="'iconfont icon-contentright'" class="icon-style"></i>
			</el-tooltip>
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item in assemblySizeListValue" :key="item" :disabled="assemblySize === item" :command="item">
					{{ assemblySizeListText[item] }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { GlobalStore } from "@/store";
import type { IAssemblySize } from "@/store/interface";

const globalStore = GlobalStore();
const assemblySize = computed(() => globalStore.assemblySize);

const assemblySizeListText = reactive<{ [propName: string]: any }>({
	default: "默认",
	large: "大号",
	small: "小号"
});

const assemblySizeListValue = reactive<string[]>(["default", "large", "small"]);

const setAssemblySize = (item: IAssemblySize) => {
	if (assemblySize.value === item) return;
	globalStore.setAssemblySizeSize(item);
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
