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
import { getMenuList } from "@/api/modules/login";
import { useRoute } from "vue-router";
import { loadingSvg } from "@/utils/svg";
//import { handleRouter } from "@/utils/util";
import Logo from "./components/Logo.vue";
import SubItem from "./components/SubItem.vue";

const route = useRoute();
// 菜单加载 loading
const loading = ref(false);

const activeMenu = computed((): string => route.path);
const menuList = ref<Menu.MenuOptions[]>([]);
const isCollapse = ref(true);

onMounted(async () => {
	// 获取菜单列表
	loading.value = true;
	try {
		const res = await getMenuList();
		if (!res.data) return;
		// 把路由菜单处理成一维数组（存储到 pinia 中）
		//const dynamicRouter = handleRouter(res.data);
		//authStore.setAuthRouter(dynamicRouter);
		menuList.value = res.data;
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
