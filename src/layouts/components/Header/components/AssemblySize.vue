<!-- 头部 el ui尺寸控制部件 -->
<template>
	<el-dropdown trigger="click" @command="setAssemblySize">
		<i :class="'iconfont icon-contentright'" class="toolBar-icon"></i>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="size in assemblySizeKey" :key="size" :disabled="assemblySize === size" :command="size">
					{{ assemblySizeText[size] }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { GlobalStore } from "@/store";

const globalStore = GlobalStore();
const assemblySize = computed(() => globalStore.assemblySize);
const assemblySizeText = reactive({
	default: "默认",
	large: "大型",
	small: "小型"
});
const assemblySizeKey = reactive<(keyof typeof assemblySizeText)[]>(["default", "large", "small"]);

const setAssemblySize = (item: keyof typeof assemblySizeText) => {
	if (assemblySize.value === item) return;
	globalStore.setAssemblySizeSize(item);
};
</script>
