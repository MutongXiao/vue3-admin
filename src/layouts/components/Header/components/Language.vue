<!-- 头部语言文字切换部件 -->
<template>
	<el-dropdown trigger="click" @command="changeLanguage">
		<i :class="'iconfont icon-zhongyingwen'" class="toolBar-icon"></i>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item :disabled="!!storeLanguage && storeLanguage === 'zh'" command="zh">简体中文</el-dropdown-item>
				<el-dropdown-item :disabled="!!storeLanguage && storeLanguage === 'en'" command="en">English</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { GlobalStore } from "@/store";
import { getBrowserLang } from "@/utils/util";

const i18n = useI18n();
const globalStore = GlobalStore();
const storeLanguage = computed((): string => globalStore.language);

// 切换语言
const changeLanguage = (lang: string) => {
	i18n.locale.value = lang;
	globalStore.updateLanguage(lang);
};
onMounted(() => {
	changeLanguage(storeLanguage.value || getBrowserLang());
});
</script>
