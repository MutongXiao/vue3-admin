<template>
	<el-icon class="icon-hover" @click="handleCollapse"><CollapseIcon /></el-icon>
</template>

<script lang="ts" setup>
import useStore from "@/stores";
import { Expand, Fold } from "@element-plus/icons-vue";

const store = useStore();
const CollapseIcon = computed(() => {
	return store.isCollapse ? Expand : Fold;
});
const handleCollapse = () => {
	store.toggleIsCallapse();
};
</script>

<style scoped lang="scss">
.icon-hover {
	cursor: pointer;
}
</style>
