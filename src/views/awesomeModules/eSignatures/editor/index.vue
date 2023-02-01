<template>
	<div class="editorWrap">
		<div class="cpArea">
			<slot :config="config"></slot>
		</div>
		<div class="editorArea">
			<ElAlert v-if="errorMsg" :title="errorMsg" type="error" show-icon effect="dark" />
			<ElInput
				v-model="code"
				type="textarea"
				autosize
				placeholder="在此处输入文字"
				:style="{ marginTop: 6, background: '#1e1e1e', color: '#ffffff' }"
			/>
			<ElButton type="primary" @click="handleRun" :style="{ marginTop: 12 }">运行</ElButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface IProps {
	direction?: "vertical" | "horizontal";
	minSize?: number;
	defaultSize?: number;
	initValue?: any;
}

const props = withDefaults(defineProps<IProps>(), {
	direction: "vertical",
	minSize: 100,
	defaultSize: 460
});
const errorMsg = ref("");
const code = ref("");
const config = ref<Record<string, any>>({});

const handleRun = () => {
	try {
		errorMsg.value = "";
		config.value = JSON.parse(code.value);
	} catch (err: any) {
		errorMsg.value = "JSON格式错误";
		config.value = {};
	}
};
watch(
	() => props.initValue,
	value => {
		try {
			code.value = JSON.stringify(value, null, 4);
			config.value = value;
		} catch (err: any) {
			code.value = "";
			errorMsg.value = "格式错误";
		}
	},
	{
		immediate: true
	}
);
</script>

<style scoped lang="scss">
.editorWrap {
	position: relative;
	display: flex;
	min-height: 360px;
	.cpArea {
		padding-right: 20px;
		border-right: 1px solid #cccccc;
	}
	.editorArea {
		width: 360px;
		margin-left: 20px;
	}
}
</style>
