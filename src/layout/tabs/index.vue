<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TabsStore } from "@/store/modules/tabs";
import type { TabPanelName, TabsPaneContext } from "element-plus";
import MoreButton from "./components/MoreButton.vue";

const tabStore = TabsStore();
const tabsMenuList = computed(() => tabStore.tabsMenuList);
const tabMenuValue = computed({
	get() {
		return tabStore.tabsMenuValue;
	},
	set(val) {
		tabStore.setTabsMenuValue(val);
	}
});

const route = useRoute();
const router = useRouter();

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
	// 响应式属性的监听
	() => route.path,
	// 数据变化后的执行回调
	() => {
		let params = {
			title: route.meta.title as string,
			path: route.path,
			close: true
		};
		tabStore.addTabs(params);
	},
	{
		// 在干渲染时就立即执行
		immediate: true
	}
);
// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
	let path = tabItem.props.name as string;
	router.push(path);
};
// Remove Tab
const tabRemove = (activeTabPath: TabPanelName) => {
	tabStore.removeTabs(activeTabPath.toString());
};
</script>

<template>
	<div class="tabs-box">
		<div class="tabs-menu">
			<el-tabs v-model="tabMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
				<el-tab-pane
					v-for="item in tabsMenuList"
					:key="item.path"
					:path="item.path"
					:label="item.title"
					:name="item.path"
					:closable="item.close"
				>
					<template #label>
						<el-icon class="tabs-icon" v-if="item.icon">
							<component :is="item.icon"></component>
						</el-icon>
						{{ item.title }}
					</template>
				</el-tab-pane>
			</el-tabs>
			<MoreButton></MoreButton>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "./index.scss";
</style>
