<template>
	<div class="upload-box">
		<el-progress v-if="isUploading" type="circle" :percentage="percentage" />
		<el-upload
			v-else
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
import { ElNotification } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";
import { uploadImg } from "@/api/modules/upload";
import { ref } from "vue";

interface IUploadFileProps {
	imageUrl: string; // 图片显示src ==> 必传
	id?: string; // 组件id ==> 非必传，当页面存在多个上传组件时必传（默认为upload）
	drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为true）
	disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为false）
	fileSize?: number; // 单个文件大小限制 ==> 非必传（默认为 5M）
	uploadStyle?: { [key: string]: any }; // 上传组件样式 ==> 非必传
	compressImg?: boolean; // 是否压缩上传
}
// 定义接收父组件所传的props以及默认值
const props = withDefaults(defineProps<IUploadFileProps>(), {
	id: "upload",
	drag: true,
	disabled: false,
	fileSize: 5,
	uploadStyle: () => ({ width: "175px", height: "175px" }),
	compressImg: false
});

// 上传进度
const percentage = ref(0);
// 是否处于上传状态
const isUploading = ref(false);

/**
 * @description 自定义事件，图片上传
 * @param options 上传的文件
 * */
interface UploadingEmits {
	(e: "update:imageUrl", value: string): void;
	(e: "check-validate"): void;
}
const emit = defineEmits<UploadingEmits>();

// 使用原生js压缩上传思路：File -> image Object -> canvas -> 压缩函数+toBold
// 压缩前将file转image对象
function readImg(file: File) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		const reader = new FileReader();
		reader.onload = function (e: any) {
			img.src = e.target.result;
		};
		reader.onerror = function (e) {
			reject(e);
		};
		// 将读取的文件转url引用二进制数据
		reader.readAsDataURL(file);
		img.onload = function () {
			resolve(img);
		};
		img.onerror = function (e) {
			reject(e);
		};
	});
}
/**
 * 压缩图片
 * @param img 被压缩的image对象
 * @param type 压缩后转换的文件类型
 * @param mx 触发压缩的图片最大宽度限制
 * @param mh 触发的压缩图片最大高度限制
 * @param quality 压缩质量
 */
function compressImg(img: HTMLImageElement, type: string, mx: number, mh: number, quality: number = 1) {
	return new Promise<Blob | null>((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const { width: originWidth, height: originHeight } = img;
		// 最大尺寸限制
		const maxWidth = mx;
		const maxHeight = mh;
		// 目标尺寸
		let targetWidth = originWidth;
		let targetHeight = originHeight;
		if (originWidth > maxWidth || originHeight > maxHeight) {
			if (originWidth / originHeight > 1) {
				// 宽图片
				targetWidth = maxWidth;
				targetHeight = Math.round(maxWidth * (originHeight / originWidth));
			} else {
				// 高图片
				targetHeight = maxHeight;
				targetWidth = Math.round(maxHeight * (originWidth / originHeight));
			}
		}
		canvas.width = targetWidth;
		canvas.height = targetHeight;
		ctx?.clearRect(0, 0, targetWidth, targetHeight);
		// 图片绘制
		ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
		// 通过对canvas.toBlob设置quality参数对图片进行压缩
		canvas.toBlob(
			function (blob) {
				resolve(blob);
			},
			type || "image/png",
			quality
		);
		canvas.onerror = function (e) {
			reject(e);
		};
	});
}

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

// 自行实现上传文件的请求
const handleHttpUpload: UploadProps["httpRequest"] = async (options: UploadRequestOptions) => {
	const formData = new FormData();
	// console.log("size before compress", options.file.size);
	if (props.compressImg) {
		const imgFile = await readImg(options.file);
		const bolbFile = await compressImg(imgFile, options.file.type, 800, 800, 20);
		// console.log("size after compress", bolbFile?.size);
		// 上传压缩后的图片
		if (!bolbFile) throw "图片压缩失败";
		formData.append("file", bolbFile);
	} else {
		// 这里上传的是原图片
		formData.append("file", options.file);
	}
	isUploading.value = true;
	try {
		const { data } = await uploadImg(formData, onProgress);
		emit("update:imageUrl", data!.fileUrl);
		emit("check-validate");
	} catch (error) {
		options.onError(error as any);
	}
};

// 文件上传时的钩子
const onProgress = (evt: any) => {
	percentage.value = Math.floor((evt.loaded / evt.total) * 100);
};

// 图片上传成功提示
const uploadSuccess = () => {
	percentage.value = 0;
	isUploading.value = false;
	ElNotification({
		title: "温馨提示",
		message: "图片上传成功！",
		type: "success"
	});
};

// 图片上传错误提示
const uploadError = () => {
	percentage.value = 0;
	isUploading.value = false;
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
