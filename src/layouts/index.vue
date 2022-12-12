<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
	<component :is="LayoutComponents[themeConfig.layout]" />
	<ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import { computed } from "vue";
import { GlobalStore } from "@/store";
import ThemeDrawer from "./components/ThemeDrawer/index.vue";
import LayoutVertical from "./verticalLayout/index.vue";
import LayoutClassic from "./classicLayout/index.vue";
import LayoutTransverse from "./transverseLayout/index.vue";
import LayoutColumns from "./columnsLayout/index.vue";

const LayoutComponents: { [key: string]: any } = {
	vertical: LayoutVertical,
	classic: LayoutClassic,
	transverse: LayoutTransverse,
	columns: LayoutColumns
};

const globalStore = GlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);
</script>

<style scoped lang="scss">
.layout {
	min-width: 740px;
}
</style>
