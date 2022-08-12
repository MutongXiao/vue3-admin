<script setup lang="ts">
import { computed } from "vue";
import { TabsStore } from "@/store/modules/tabs";
import { HOME_URL } from "@/config/config";
const tabStore = TabsStore();

const otherCloseDisable = computed(
	() =>
		(tabStore.tabsMenuValue === HOME_URL && tabStore.tabsMenuList.length <= 1) ||
		(tabStore.tabsMenuValue !== HOME_URL && tabStore.tabsMenuList.length <= 2)
);

// Close Current
const closeCurrentTab = () => {
	if (tabStore.tabsMenuValue === HOME_URL) return;
	tabStore.removeTabs(tabStore.tabsMenuValue);
};

// Close Other
const closeOtherTabs = () => {
	tabStore.closeMultipleTab(tabStore.tabsMenuValue);
};

// Close All
const closeAllTab = () => {
	tabStore.closeMultipleTab();
	tabStore.goHome();
};
</script>

<template>
	<el-dropdown trigger="click">
		<el-button size="small" type="primary">
			<span>{{ $t("tabs.more") }}</span>
			<el-icon class="el-icon--right"><arrow-down /></el-icon>
		</el-button>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="closeCurrentTab" :disabled="tabStore.tabsMenuValue === HOME_URL">{{
					$t("tabs.closeCurrent")
				}}</el-dropdown-item>
				<el-dropdown-item @click="closeOtherTabs" :disabled="otherCloseDisable">{{ $t("tabs.closeOther") }}</el-dropdown-item>
				<el-dropdown-item @click="closeAllTab" :disabled="tabStore.tabsMenuList.length <= 1">{{
					$t("tabs.closeAll")
				}}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<style scoped lang="scss">
@import "../index.scss";
</style>
