<template>
	<el-breadcrumb :separator-icon="ArrowRight">
		<transition-group name="breadcrumb" mode="out-in">
			<template v-if="nodeBreadcrumbList">
				<!-- 首页面包屑不要可以直接删除 🙅‍♀️ -->
				<el-breadcrumb-item :key="HOME_URL" :to="{ path: HOME_URL }" v-if="nodeBreadcrumbList[0].meta.title !== '首页'">
					<div class="breadcrumb-item">
						<el-icon class="breadcrumb-icon" v-if="themeConfig.breadcrumbIcon">
							<HomeFilled />
						</el-icon>
						<span class="breadcrumb-title">首页</span>
					</div>
				</el-breadcrumb-item>
				<!-- other -->
				<el-breadcrumb-item v-for="(item, index) in nodeBreadcrumbList" :key="item.path">
					<div class="breadcrumb-item el-breadcrumb__inner is-link" @click="onBreadcrumbClick(item, index)">
						<el-icon class="breadcrumb-icon" v-if="item.meta.icon && themeConfig.breadcrumbIcon">
							<component :is="item.meta.icon"></component>
						</el-icon>
						<span class="breadcrumb-title">{{ item.meta.title }}</span>
					</div>
				</el-breadcrumb-item>
			</template>
		</transition-group>
	</el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from "@element-plus/icons-vue";
import { computed } from "vue";
import { GlobalStore } from "@/store";
import { AuthStore } from "@/store/modules/auth";
import { useRoute, useRouter } from "vue-router";
import { HOME_URL } from "@/config/config";

const route = useRoute();
const router = useRouter();
const globalStore = GlobalStore();
const authStore = AuthStore();
const themeConfig = computed(() => globalStore.themeConfig);
const nodeBreadcrumbList = computed(() => authStore.breadcrumbList[route.matched[route.matched.length - 1].path]);

const onBreadcrumbClick = (item: any, index: number) => {
	if (!nodeBreadcrumbList.value) return;
	if (index !== nodeBreadcrumbList.value.length - 1) router.push(item.path);
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 1000px) {
	.el-breadcrumb {
		display: none;
	}
}
.breadcrumb-item {
	display: flex;
	align-items: center;
	.breadcrumb-icon {
		margin-right: 6px;
		font-size: 16px;
	}
}
</style>
