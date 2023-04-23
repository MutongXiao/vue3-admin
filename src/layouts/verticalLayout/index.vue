<!-- 纵向布局 -->
<template>
	<el-container class="layout">
		<el-aside :style="{ backgroundColor: themColor, borderRight: `1px solid ${themColor}` }">
			<div class="menu" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo flx-center">
					<img src="@/assets/images/logo.svg" alt="logo" />
					<span v-show="!isCollapse">Vue3 Admin</span>
				</div>
				<el-scrollbar>
					<el-menu
						:default-active="activeMenu"
						:router="false"
						:collapse="isCollapse"
						:collapse-transition="false"
						:unique-opened="true"
						:background-color="themColor"
						text-color="#ffffff"
						:active-text-color="themColor"
					>
						<SubMenu :menuList="menuList" />
					</el-menu>
				</el-scrollbar>
			</div>
		</el-aside>
		<el-container>
			<el-header>
				<ToolBarLeft />
				<ToolBarRight />
			</el-header>
			<Main />
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutVertical">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { GlobalStore } from "@/store";
import { AuthStore } from "@/store/modules/auth";
import Main from "@/layouts/components/Main/index.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";

const route = useRoute();
const authStore = AuthStore();
const globalStore = GlobalStore();
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
const menuList = computed(() => authStore.showMenuList);
const isCollapse = computed(() => globalStore.themeConfig.isCollapse);
const themColor = computed(() => globalStore.themeConfig.primary);

// const handleMenuSelect = (item: Menu.MenuOptions) => {
// 	const activeItem = document.querySelector(`.el-menu-item.is-active"]`);
// 	console.log('item', item.);

// 	console.log("activeItem", activeItem);
// };
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

<style lang="scss">
.vertical {
	.el-menu,
	.el-menu--popup {
		.el-menu-item {
			&.is-active {
				background: #ffffff;
				&::before {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					width: 4px;
					content: "";
					background: var(--el-color-primary);
				}
			}
		}
	}
}
</style>
