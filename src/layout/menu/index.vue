<template>
	<div
		class="menu"
		:style="{ width: isCollapse ? '65px' : '220px' }"
		v-loading="loading"
		element-loading-text="Loading..."
		:element-loading-spinner="loadingSvg"
		element-loading-svg-view-box="-10, -10, 50, 50"
		element-loading-background="rgba(122, 122, 122, 0.01)"
	>
		<Logo :isCollapse="isCollapse"></Logo>
		<el-scrollbar>
			<el-menu
				:default-active="activeMenu"
				:collapse="isCollapse"
				:router="true"
				:collapse-transition="false"
				:unique-opened="true"
				background-color="#191a20"
				text-color="#bdbdc0"
				active-text-color="#fff"
			>
				<SubItem :menuList="menuList"></SubItem>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { getMenuList } from "@/api/modules/login";
import { useRoute } from "vue-router";
import { loadingSvg } from "@/utils/svg";
import { MenuStore } from "@/store/modules/menu";
import { AuthStore } from "@/store/modules/auth";
import { GlobalStore } from "@/store";
import { handleRouter } from "@/utils/util";
import Logo from "./components/Logo.vue";
import SubItem from "./components/SubItem.vue";

const route = useRoute();
const globalStore = GlobalStore();
const menuStore = MenuStore();
const authStore = AuthStore();

// 菜单加载 loading
const loading = ref(false);

const activeMenu = computed((): string => route.path);
const isCollapse = computed(() => menuStore.isCollapse);
const menuList = computed(() => menuStore.menuList);

// aside 自适应
// 监听窗口大小变化，合并 aside
const windoeResizeHandler = () => {
	const screenWidth = document.body.clientWidth;
	if (isCollapse.value === false && screenWidth < 1200) menuStore.setCollapse();
	if (isCollapse.value === true && screenWidth > 1200) menuStore.setCollapse();
};

onMounted(async () => {
	// 获取菜单列表
	loading.value = true;
	try {
		if (!globalStore.token) {
			return;
		}
		const res = await getMenuList();
		if (!res.data) return;
		//把路由菜单处理成一维数组（存储到 pinia 中）, 用于在路由守卫者做访问鉴权
		const dynamicRouters = handleRouter(res.data);
		authStore.setAuthRouters(dynamicRouters);
		// 未做处理的数据保存，用于生成菜单
		menuStore.setMenuList(res.data);
	} finally {
		loading.value = false;
		window.addEventListener("resize", windoeResizeHandler);
	}
});

onUnmounted(() => {
	window.removeEventListener("resize", windoeResizeHandler);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
