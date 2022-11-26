<template>
	<div>
		<div class="changeRadio">
			<el-radio-group v-model="radio">
				<el-radio :label="1">表格计算示例</el-radio>
				<el-radio :label="2">canvas绘制示例</el-radio>
			</el-radio-group>
		</div>
		<dataListTable v-if="radio === 1" />
		<canvasDemo v-if="radio === 2" />
	</div>
</template>

<script setup lang="ts">
import canvasDemo from "./demo/canvasDemo.vue";
import dataListTable from "./demo/dataListTable.vue";
import { ref } from "vue";

const radio = ref<number>(1);
</script>

<style scoped lang="scss">
.changeRadio {
	height: 60px;
	line-height: 60px;
	text-align: center;
	background: #f2f6fc;
	.el-radio-group {
		margin: 0 auto;
	}
}
</style>
