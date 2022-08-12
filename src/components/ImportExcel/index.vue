<template>
	<el-dialog v-model="dialogVisible" :title="`批量添加${parameter.title}`" :destroy-on-close="true" width="580px" draggable>
		<el-form class="drawer-multiColumn-form" label-width="100px">
			<el-form-item label="模板下载 :">
				<el-button @click="downloadTemp" type="primary" :icon="Download">点击下载</el-button>
			</el-form-item>
			<el-form-item label="文件上传 :">
				<el-upload
					:limit="excelLimit"
					:http-request="uploadExcel"
					:before-upload="beforeExcelUpload"
					:on-exceed="handleExceed"
					:on-success="excelUploadSuccess"
					:on-error="excelUploadError"
					class="upload"
					action="string"
					:drag="true"
					:multiple="true"
					:show-file-list="true"
					accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				>
					<el-icon class="el-icon--upload"><upload-filled /></el-icon>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<template #tip>
						<div class="el-upload__tip">请上传 .xls , .xlsx 标准格式文件</div>
					</template>
				</el-upload>
			</el-form-item>
			<el-form-item label="数据覆盖 :">
				<el-switch v-model="isCover"></el-switch>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
import { useDownload } from "@/hooks/useDownload";
import { Download } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { ref } from "vue";

export interface ExcelParameterProps {
	title: string; // 标题
	tempApi: (params: any) => Promise<any>; // 下载模板的Api
	importApi: (params: any) => Promise<any>; // 批量导入的Api
	getTableList?: () => Promise<any>; // 获取表格数据的Api
}

// 对话框显示与隐藏控制状态
const dialogVisible = ref(false);
// 最大文件上传数
const excelLimit = ref(1);
// 是否覆盖数据
const isCover = ref(false);
// 父组件传过来的参数
const parameter = ref<Partial<ExcelParameterProps>>({});

// 通过ref对外暴露的函数，接收父组件参数
const acceptParams = (params?: any) => {
	parameter.value = params;
	// 父组件传参，显示对话框
	dialogVisible.value = true;
};

// Excel 导入模板下载
const downloadTemp = () => {
	if (!parameter.value.tempApi) return;
	useDownload(parameter.value.tempApi, `${parameter.value.title}模板`);
};

// 文件上传
const uploadExcel = async (param: any) => {
	let excelFormData = new FormData();
	excelFormData.append("file", param.title);
	excelFormData.append("isCover", isCover.value as unknown as Blob);
	await parameter.value.importApi!(excelFormData);
	parameter.value.getTableList && parameter.value.getTableList();
	dialogVisible.value = false;
};

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file: any) => {
	const isExcel =
		file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	const isLt5M = file.size / 1024 / 1024 < 5;
	if (!isExcel) {
		ElNotification({
			title: "温馨提示",
			message: "上传文件只能是 xls / xlsx 格式！",
			type: "warning"
		});
	}
	if (!isLt5M) {
		ElNotification({
			title: "温馨提示",
			message: "上传文件大小不能超过 5MB！",
			type: "warning"
		});
	}
	return isExcel && isLt5M;
};

// 文件数超出提示
const handleExceed = (): void => {
	ElNotification({
		title: "温馨提示",
		message: "最多只能上传一个文件！",
		type: "warning"
	});
};

// 上传错误提示
const excelUploadError = (): void => {
	ElNotification({
		title: "温馨提示",
		message: `批量添加${parameter.value.title}失败，请您重新上传！`,
		type: "error"
	});
};

// 上传成功提示
const excelUploadSuccess = (): void => {
	ElNotification({
		title: "温馨提示",
		message: `批量添加${parameter.value.title}成功！`,
		type: "success"
	});
};

// 外部通过ref，只能拿到acceptParams
defineExpose({
	acceptParams
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
