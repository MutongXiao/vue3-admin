<template>
	<div class="content-box">
		<TreeFilter
			label="name"
			title="部门列表(单选)"
			:data="depFilterData"
			:defaultValue="treeFilterValues.departmentId"
			@change="changeTreeFilter"
		/>
		<TreeFilter
			title="部门列表(多选)"
			multiple
			label="name"
			:data="depFilterData"
			:defaultValue="treeFilterValues1.departmentId"
			@change="changeTreeFilter1"
		/>
		<div class="descriptions-box card">
			<span class="text"> 树形筛选器 🍓🍇🍈🍉</span>
			<el-descriptions title="配置项 📚" :column="1" border>
				<el-descriptions-item label="requestApi"> 请求分类数据的 api </el-descriptions-item>
				<el-descriptions-item label="data"> 分类数据，如果有分类数据，则不会执行 api 请求 </el-descriptions-item>
				<el-descriptions-item label="title"> treeFilter 标题 </el-descriptions-item>
				<el-descriptions-item label="id"> 选择的id，默认为 “id” </el-descriptions-item>
				<el-descriptions-item label="label"> 显示的label，默认为 “label” </el-descriptions-item>
				<el-descriptions-item label="multiple"> 是否为多选，默认为 false </el-descriptions-item>
				<el-descriptions-item label="defaultValue"> 默认选中的值 </el-descriptions-item>
			</el-descriptions>
		</div>
	</div>
</template>

<script setup lang="ts" name="treeFilter">
import { reactive, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getUserDepartment } from "@/api/modules/user";
import type { User } from "@/api/interface";
import TreeFilter from "@/components/TreeFilter/index.vue";

const treeFilterValues = reactive({ departmentId: "1" });
const changeTreeFilter = (val: string) => {
	ElMessage.success(`你选择了 id 为 ${val} 的数据🤔`);
	treeFilterValues.departmentId = val;
};

const treeFilterValues1 = reactive({ departmentId: ["11"] });
const changeTreeFilter1 = (val: string[]) => {
	ElMessage.success(`你选择了 id 为 ${JSON.stringify(val)} 的数据🤔`);
	treeFilterValues1.departmentId = val;
};

const depFilterData = ref<User.ResDepartment[]>([]);

onMounted(async () => {
	const { data } = await getUserDepartment();
	depFilterData.value = data;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
