<template>
	<div class="directory-nav">
		<div v-if="navigationFolders.length > 0" class="nav-item">
			<span class="hight-light" @click="handleClick('GOBACK')"> 返回上一级 </span>
			<p>|</p>
		</div>
		<div class="nav-item">
			<span :class="{ 'hight-light': navigationFolders.length > 0 }" @click="handleClick('GOROOT')">全部文件</span>
			<el-icon v-if="navigationFolders.length > 0"><ArrowRight /></el-icon>
		</div>
		<template v-for="(item, index) in navigationFolders" :key="item._id">
			<div class="nav-item">
				<span :class="{ 'hight-light': index < navigationFolders.length - 1 }" @click="handleClick('GOTARGET', item._id)">
					{{ item.name }}
				</span>
				<el-icon v-if="index < navigationFolders.length - 1"><ArrowRight /></el-icon>
			</div>
		</template>
	</div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { GlobalStore } from "@/store";
import { getAncestors, type RowData } from "../index";

const props = defineProps<{ currentFolderId: string; files: RowData[] }>();
const emits = defineEmits<{ (e: "click", folderID: string, navigationFolders?: RowData[]): void }>();

const globalStore = GlobalStore();
const themColor = computed(() => globalStore.themeConfig.primary);
const navigationFolders = computed<RowData[]>(() => getAncestors(props.currentFolderId, props.files));

const handleClick = (action: "GOROOT" | "GOBACK" | "GOTARGET", folderId?: string) => {
	if (action === "GOROOT") {
		emits("click", "/", navigationFolders.value);
		return;
	}
	if (action === "GOBACK") {
		const folders = navigationFolders.value;
		const folderId = folders.length > 1 ? folders[folders.length - 2]._id : "/";
		emits("click", folderId, navigationFolders.value);
		return;
	}
	action === "GOTARGET" && folderId && emits("click", folderId, navigationFolders.value);
};

defineExpose({
	navigationFolders
});
</script>
<style scoped lang="scss">
.directory-nav {
	display: flex;
	align-items: center;
	height: 45px;
	.nav-item {
		display: flex;
		align-items: center;
		padding: 2px 0;
		margin-left: 6px;
		font-size: inherit;
		span {
			max-width: 130px;
			padding-right: 6px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.hight-light {
		color: v-bind(themColor);
		cursor: pointer;
	}
}
</style>
