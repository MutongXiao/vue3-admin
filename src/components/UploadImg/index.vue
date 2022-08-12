<template>
	<div class="upload-box">
		<el-upload
			:http-request="handleHttpUpload"
			:before-upload="beforeUpload"
			:on-success="uploadSuccess"
			:on-error="uploadError"
			:id="id"
			:disabled="disabled"
			:style="uploadStyle"
			:drag="drag"
			:multiple="false"
			:class="['upload']"
			:show-file-list="false"
			action="#"
			accept="image/jpeg,image/jpeg,image/png"
		>
			<img v-if="imageUrl" :src="imageUrl" class="upload-image" />
			<el-icon v-else class="upload-icon"><Plus /></el-icon>
			<!-- @click.stop 阻止点冒泡，触发el-upload上传事件 -->
			<div v-if="imageUrl" class="upload-handle" @click.stop>
				<div v-if="!disabled" @click="editImg" class="handle-icon">
					<el-icon><Edit /></el-icon>
					<span>编辑</span>
				</div>
				<div @click="imageView" class="handle-icon">
					<el-icon><ZoomIn /></el-icon>
					<span>查看</span>
				</div>
				<div v-if="!disabled" @click="deleteImg" class="handle-icon">
					<el-icon><Delete /></el-icon>
					<span>删除</span>
				</div>
			</div>
		</el-upload>
		<div class="el-upload__tip">
			<slot name="tip"></slot>
		</div>
		<el-image-viewer v-if="dialogVisible" @close="imageView" :url-list="[imageUrl]" />
	</div>
</template>

<script setup lang="ts" name="uploadImg">
import { Plus } from "@element-plus/icons-vue";
import { ElNotification, type UploadProps, type UploadRequestOptions } from "element-plus";
import { uploadImg } from "@/api/modules/upload";
import { ref } from "vue";

interface IUploadFileProps {
	imageUrl: string; // 图片显示src ==> 必传
	id?: string; // 组件id ==> 非必传，当页面存在多个上传组件时必传（默认为upload）
	drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为true）
	disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为false）
	fileSize?: number; // 单个文件大小限制 ==> 非必传（默认为 5M）
	uploadStyle?: { [key: string]: any }; // 上传组件样式 ==> 非必传
}
// 定义接收父组件所传的props以及默认值
const props = withDefaults(defineProps<IUploadFileProps>(), {
	id: "upload",
	drag: true,
	disabled: false,
	fileSize: 5,
	uploadStyle: () => ({ width: "175px", height: "175px" })
});

/**
 * @description 自定义事件，图片上传
 * @param options 上传的文件
 * */
interface UploadingEmits {
	(e: "update:imageUrl", value: string): void;
	(e: "check-validate"): void;
}
const emit = defineEmits<UploadingEmits>();

/**
 * @description 文件上传之前判断
 * @param rawFile 上传的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
	const isLt3M = rawFile.size / 1024 / 1024 < props.fileSize;
	const imgType = ["image/jpg", "image/jpeg", "image/png"];
	if (!imgType.includes(rawFile.type))
		ElNotification({
			title: "温馨提示",
			message: "上传图片必须是 JPG/JPEG/PNG 格式！",
			type: "warning"
		});
	if (!isLt3M)
		ElNotification({
			title: "温馨提示",
			message: `上传图片大小不能超过 ${props.fileSize}MB！`,
			type: "warning"
		});
	return imgType.includes(rawFile.type) && isLt3M;
};

const handleHttpUpload: UploadProps["httpRequest"] = async (options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append("file", options.file);
	try {
		const { data } = await uploadImg(formData);
		emit("update:imageUrl", data!.fileUrl);
		emit("check-validate");
	} catch (error) {
		options.onError(error as any);
	}
};

// 图片上传成功提示
const uploadSuccess = () => {
	ElNotification({
		title: "温馨提示",
		message: "图片上传成功！",
		type: "success"
	});
};

// 图片上传错误提示
const uploadError = () => {
	ElNotification({
		title: "温馨提示",
		message: "图片上传失败，请您重新上传！",
		type: "error"
	});
};

/**
 * @description 删除图片
 * */
const deleteImg = () => {
	emit("update:imageUrl", "");
};
/**
 * @description 编辑图片
 * */
const editImg = () => {
	const dom = document.querySelector(`#${props.id} .el-upload__input`);
	// 派发事件，触发 el-upload 组件鼠标点击
	dom!.dispatchEvent(new MouseEvent("click"));
};

// 查看预览图片
const dialogVisible = ref(false);
const imageView = () => {
	dialogVisible.value = !dialogVisible.value;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
