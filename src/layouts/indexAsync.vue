<!-- 💥 这里是异步加载 LayoutComponents -->
<template>
	<suspense>
		<template #default>
			<component :is="LayoutComponents[themeConfig.layout]" />
		</template>
		<template #fallback>
			<Loading />
		</template>
	</suspense>
	<ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import { computed, defineAsyncComponent } from "vue";
import { GlobalStore } from "@/store";
import Loading from "@/components/Loading/index.vue";
import ThemeDrawer from "./components/ThemeDrawer/index.vue";

const LayoutComponents: { [key: string]: any } = {
	vertical: defineAsyncComponent(() => import("./verticalLayout/index.vue")),
	classic: defineAsyncComponent(() => import("./classicLayout/index.vue")),
	transverse: defineAsyncComponent(() => import("./transverseLayout/index.vue")),
	columns: defineAsyncComponent(() => import("./columnsLayout/index.vue"))
};

const globalStore = GlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);
</script>

<style scoped lang="scss">
.layout {
	min-width: 740px;
}
</style>
