<!-- 纵向布局 -->
<template>
	<el-container class="layout">
		<el-aside :style="{ backgroundColor: themColor }">
			<div class="menu" :style="{ width: isCollapse ? '65px' : '210px' }">
				<div class="logo flx-center">
					<img src="@/assets/images/logo.svg" alt="logo" />
					<span v-show="!isCollapse">Vue3 Admin</span>
				</div>
				<el-scrollbar>
					<el-menu
						id="verticalMenu"
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
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

<style lang="scss">
.vertical {
	.el-menu,
	.el-menu--inline {
		.el-menu-item {
			&.is-active {
				background: #ffffff;
				border-top-left-radius: 25px;
				border-bottom-left-radius: 25px;
				&::before,
				&::after {
					position: absolute;
					right: 0;
					z-index: 99;
					width: 25px;
					height: 20px;
					content: "";
				}
				&::before {
					top: -19px;

					// 水平半轴 26.5px 垂直半轴 25px，中心位置 0 0（左上角）
					background: radial-gradient(25px 19px at 0 0, transparent, transparent 100%, #ffffff);
				}
				&::after {
					bottom: -19px;
					background: radial-gradient(25px 19px at 0 20px, transparent, transparent 100%, #ffffff);
				}
			}
		}
	}
	.el-menu--popup {
		.el-menu-item {
			&.is-active {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				&::before,
				&::after {
					display: none;
				}

				// &::before {
				// 	position: absolute;
				// 	top: 0;
				// 	bottom: 0;
				// 	left: 0;
				// 	width: 4px;
				// 	content: "";
				// 	background: var(--el-color-primary);
				// }
			}
		}
	}
}
</style>
