<template>
	<div class="content-box">
		<span class="text">批量添加数据示例 🍓🍇🍈🍉</span>
		<el-button @click="batchAdd" type="primary" :icon="Upload">批量添加数据</el-button>
		<ImportExcel ref="importRef"></ImportExcel>
		<el-descriptions title="配置项 📚" :column="1" border>
			<el-descriptions-item label="title"> 组件提示标题，上传成功之后的提示信息 </el-descriptions-item>
			<el-descriptions-item label="tempApi"> 下载模板的 Api </el-descriptions-item>
			<el-descriptions-item label="importApi"> 上传数据的 Api </el-descriptions-item>
			<el-descriptions-item label="getTableList"> 上传数据成功之后，刷新表格数据的 Api </el-descriptions-item>
		</el-descriptions>
	</div>
</template>

<script setup lang="ts" name="batchImport">
import { batchAddUser, exportUserInfo } from "@/api/modules/user";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { Upload } from "@element-plus/icons-vue";
import { ref } from "vue";

interface DialogExpose {
	acceptParams: (params: any) => void;
}
const importRef = ref<DialogExpose>();

const batchAdd = () => {
	let params = {
		title: "数据",
		tempApi: exportUserInfo,
		importApi: batchAddUser
	};
	importRef.value!.acceptParams(params);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
