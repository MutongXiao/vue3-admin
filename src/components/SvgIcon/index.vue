<template>
	<svg :style="iconStyle" aria-hidden="true">
		<use :xlink:href="symbolId" />
	</svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from "vue";

interface ISvgProps {
	name: string; // 图标的名称 ==> 必传
	prefix?: string; // 图标的前缀 ==> 非必传（默认为"icon"）
	iconStyle?: { [key: string]: any }; // 图标的样式 ==> 非必传
}

// 设置props默认值
const props = withDefaults(defineProps<ISvgProps>(), {
	prefix: "icon",
	iconStyle: () => ({ width: "100px", height: "100px" })
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
