<template>
	<el-dropdown trigger="click">
		<el-button size="small" type="primary">
			<span>{{ $t("tabs.more") }}</span>
			<el-icon class="el-icon--right"><arrow-down /></el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="refresh">
					<el-icon><Refresh /></el-icon>{{ $t("tabs.refresh") }}
				</el-dropdown-item>
				<el-dropdown-item @click="maximize">
					<el-icon><FullScreen /></el-icon>{{ $t("tabs.maximize") }}
				</el-dropdown-item>
				<el-dropdown-item divided @click="closeCurrentTab">
					<el-icon><Remove /></el-icon>{{ $t("tabs.closeCurrent") }}
				</el-dropdown-item>
				<el-dropdown-item @click="closeOtherTab">
					<el-icon><CircleClose /></el-icon>{{ $t("tabs.closeOther") }}
				</el-dropdown-item>
				<el-dropdown-item @click="closeAllTab">
					<el-icon><FolderDelete /></el-icon>{{ $t("tabs.closeAll") }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { computed, inject, nextTick } from "vue";
import { HOME_URL } from "@/config/config";
import { GlobalStore } from "@/store";
import { TabsStore } from "@/store/modules/tabs";
import { KeepAliveStore } from "@/store/modules/keepAlive";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const tabStore = TabsStore();
const globalStore = GlobalStore();
const keepAliveStore = KeepAliveStore();
const themeConfig = computed(() => globalStore.themeConfig);
// 获取 main 中provide 提供的刷新方法，其刷新原理是通过切换 v-if 实现刷新
const refreshCurrentPage: Function = inject("refresh") as Function;
// refresh current page
const refresh = () => {
	setTimeout(() => {
		keepAliveStore.removeKeepLiveName(route.name as string);
		refreshCurrentPage(false);
		nextTick(() => {
			keepAliveStore.addKeepLiveName(route.name as string);
			refreshCurrentPage(true);
		});
	}, 0);
};

// maximize current page
const maximize = () => {
	globalStore.setThemeConfig({ ...themeConfig.value, maximize: true });
};

// Close Current
const closeCurrentTab = () => {
	if (route.meta.isAffix) return;
	tabStore.removeTabs(route.fullPath);
	keepAliveStore.removeKeepLiveName(route.name as string);
};

// Close Other
const closeOtherTab = () => {
	tabStore.closeMultipleTab(route.fullPath);
	keepAliveStore.setKeepAliveName([route.name] as string[]);
};

// Close All
const closeAllTab = () => {
	tabStore.closeMultipleTab();
	// 设置 KeepAliveName 为 []
	keepAliveStore.setKeepAliveName([]);
	router.push(HOME_URL);
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
