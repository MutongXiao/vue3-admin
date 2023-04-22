<template>
	<div class="editorWrap">
		<div class="cpArea">
			<slot :config="configJson"></slot>
		</div>
		<div class="editorArea">
			<ElAlert v-if="errorMsg" :title="errorMsg" type="error" show-icon effect="dark" />
			<el-alert title="在下方设置画布的相关配置 ⬇" type="info" :closable="false" />
			<ElInput
				v-model="configInputText"
				type="textarea"
				autosize
				placeholder="在此处输入配置文本"
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
	initEditorConfig?: Record<string, any>;
}

const props = withDefaults(defineProps<IProps>(), {
	direction: "vertical",
	minSize: 100,
	defaultSize: 460
});
const errorMsg = ref("");
const configInputText = ref("");
const configJson = ref<Record<string, any>>({});
// 转化配置文本为 JSON
const handleRun = () => {
	try {
		errorMsg.value = "";
		configJson.value = JSON.parse(configInputText.value);
	} catch (err: any) {
		errorMsg.value = "JSON格式错误";
		configJson.value = {};
	}
};

watch(
	() => props.initEditorConfig,
	value => {
		try {
			configInputText.value = JSON.stringify(value, null, 4);
			configJson.value = value!;
		} catch (err: any) {
			configInputText.value = "";
			errorMsg.value = "格式错误";
		}
	},
	{
		// 在侦听器创建时立即触发回调 (第一次调用时旧值是 undefined, 新值是 props.initEditorConfig), 以便将 props.initEditorConfig 同步到输入框.
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
