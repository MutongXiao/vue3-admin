<template>
	<Maximize v-if="themeConfig.maximize" />
	<Tabs v-if="themeConfig.tabs" />
	<el-main>
		<router-view v-slot="{ Component, route }">
			<transition appear name="fade-transform" mode="out-in">
				<keep-alive :include="keepLiveName">
					<component :is="Component" :key="route.fullPath" v-if="isRouterShow" />
				</keep-alive>
			</transition>
		</router-view>
	</el-main>
	<el-footer v-if="themeConfig.footer">
		<Footer />
	</el-footer>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, provide } from "vue";
import { GlobalStore } from "@/store";
import { KeepAliveStore } from "@/store/modules/keepAlive";
import Maximize from "./components/Maximize.vue";
import Tabs from "@/layouts/components/Tabs/index.vue";
import Footer from "@/layouts/components/Footer/index.vue";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@vueuse/core";

const globalStore = GlobalStore();
const keepAliveStore = KeepAliveStore();

const themeConfig = computed(() => globalStore.themeConfig);
const isCollapse = computed(() => globalStore.themeConfig.isCollapse);
// const { maximize, isCollapse, layout, tabs, footer } = storeToRefs(globalStore);

const { keepLiveName } = storeToRefs(keepAliveStore);

// 注入刷新页面方法, 通过v-if的切换实现keep-alive的刷新
const isRouterShow = ref(true);
const refreshCurrentPage = (val: boolean) => {
	isRouterShow.value = val;
};
provide("refresh", refreshCurrentPage);

// 下面的逻辑可以分别放在在对应的组件中去，也可以在此同一处理

// 监听当前页面是否最大化，动态添加 class. （在./components/Maximize.vue中）
// watch(
// 	() => maximize.value,
// 	() => {
// 		const app = document.getElementById("app") as HTMLElement;
// 		if (maximize.value) app.classList.add("main-maximize");
// 		else app.classList.remove("main-maximize");
// 	},
// 	{ immediate: true }
// );

// 监听布局变化，在 body 上添加相对应的 layout class. (在../../ThemeDrawer.vue中)
// watch(
// 	() => layout.value,
// 	() => {
// 		const body = document.body as HTMLElement;
// 		body.setAttribute("class", layout.value);
// 	},
// 	{ immediate: true }
// );

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref<number>(0);
const listeningWindow = useDebounceFn(() => {
	screenWidth.value = document.body.clientWidth;
	if (!isCollapse.value && screenWidth.value < 1200) globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: true });
	if (isCollapse.value && screenWidth.value > 1200) globalStore.setThemeConfig({ ...themeConfig.value, isCollapse: false });
}, 100);
window.addEventListener("resize", listeningWindow, false);
onBeforeUnmount(() => {
	window.removeEventListener("resize", listeningWindow);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
