<template>
	<el-dialog v-model="dialogVisible" top="0" :title="file?.fileName" class="filePreview">
		<iframe v-if="reader.readerType === 'iframe'" :src="reader.url" width="100%" height="100%" frameborder="0">
			您的浏览器不支持 iframe 预览文件
		</iframe>
		<el-image v-else-if="reader.readerType === 'image'" style="width: 100%; height: 100%" :src="reader.url" fit="contain" />
		<audio v-else-if="reader.readerType === 'audio'" :src="reader.url" controls>您的浏览器不支持 audio 标签。</audio>
		<video
			v-else-if="reader.readerType === 'video'"
			:src="reader.url"
			controls
			style="width: 100%; height: 100%; object-fit: fill"
		>
			无法播放当前视频
		</video>
		<div v-else-if="reader.readerType === 'other'" style="width: 100%; height: 100%; text-align: center">该文件暂不支持预览</div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { RowData } from "../index";

const dialogVisible = ref(false);
// const props = defineProps<{ file: RowData }>();
const file = ref<RowData | null>(null);
const reader = computed<{
	readerType?: "iframe" | "image" | "audio" | "video" | "other";
	url?: string;
}>(() => {
	const mimeType = file.value?.type;
	if (!file.value) {
		return {};
	}
	if (
		mimeType === "application/msword" ||
		mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
		mimeType === "application/vnd.ms-powerpoint" ||
		mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
		mimeType === "application/vnd.ms-excel" ||
		mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	) {
		// 'https://view.officeapps.live.com/op/embed.aspx?src'
		return {
			readerType: "iframe",
			url: `https://view.officeapps.live.com/op/view.aspx?src=${file.value.url}`
		};
	}
	if (
		mimeType === "text/plain" ||
		mimeType === "application/pdf" ||
		mimeType === "application/json" ||
		mimeType === "image/gif" ||
		mimeType === "image/svg+xml"
	) {
		return {
			readerType: "iframe",
			url: file.value.url
		};
	}
	if (mimeType?.includes("image/")) {
		return {
			readerType: "image",
			url: file.value.url
		};
	}
	if (mimeType?.includes("audio/")) {
		return {
			readerType: "audio",
			url: file.value.url
		};
	}
	if (mimeType?.includes("video/")) {
		return {
			readerType: "video",
			url: file.value.url
		};
	}
	return {
		readerType: "other",
		url: file.value.url
	};
});

const open = (openFile: RowData) => {
	file.value = openFile;
	dialogVisible.value = true;
};

defineExpose({
	open
});
</script>
<style lang="scss">
.filePreview {
	display: flex;
	flex-direction: column;
	height: 100vh;
	margin: 0 auto;
	.el-dialog__body {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		padding: 0;
	}
}
</style>
