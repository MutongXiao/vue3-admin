<template>
	<el-container>
		<el-aside>
			<Menu></Menu>
		</el-aside>
		<el-container>
			<el-header>
				<Header></Header>
				<Tabs v-if="themeConfig.tabs"></Tabs>
			</el-header>
			<el-main>
				<section class="main-box">
					<router-view v-slot="{ Component, route }">
						<transition appear name="fade-transform" mode="out-in">
							<keep-alive :include="cacheRoutes" :max="10">
								<component :is="Component" :key="route.path"></component>
							</keep-alive>
						</transition>
					</router-view>
				</section>
			</el-main>
			<el-footer v-if="themeConfig.footer">
				<Footer></Footer>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import Menu from "./menu/index.vue";
import Header from "./header/index.vue";
import Footer from "./footer/index.vue";
import Tabs from "./tabs/index.vue";
import { GlobalStore } from "@/store";
import cacheRoutes from "@/router/cacheRoutes";
import { AuthStore } from "@/store/modules/auth";
import { getAuthButtons } from "@/api/modules/login";

const authStore = AuthStore();
const globalStore = GlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);

onMounted(async () => {
	// 获取按钮权限列表
	const res = await getAuthButtons();
	res.data && authStore.setAuthButtons(res.data);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
