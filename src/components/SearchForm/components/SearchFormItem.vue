<template>
	<!-- 文本框 -->
	<template v-if="formItem.searchType == undefined || formItem.searchType == 'text'">
		<el-input
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			placeholder="请输入"
			:clearable="clearable(formItem)"
		></el-input>
	</template>
	<!-- 下拉选择框 -->
	<template v-else-if="formItem.searchType == 'select' || formItem.searchType == 'multipleSelect'">
		<el-select
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			:multiple="formItem.searchType == 'multipleSelect'"
			placeholder="请选择"
			:clearable="clearable(formItem)"
		>
			<el-option
				v-for="itemValue in formItem.enum"
				:key="itemValue[formItem.searchElComponentProps?.value] ?? itemValue.value"
				:label="itemValue[formItem.searchElComponentProps?.label] ?? itemValue.label"
				:value="itemValue[formItem.searchElComponentProps?.value] ?? itemValue.value"
				:disabled="itemValue.disabled"
			/>
		</el-select>
	</template>
	<!-- 下拉树形选择框 -->
	<template v-else-if="formItem.searchType == 'treeSelect' || formItem.searchType == 'multipleTreeSelect'">
		<el-tree-select
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			:multiple="formItem.searchType == 'multipleTreeSelect'"
			:data="formItem.enum"
		/>
	</template>
	<!-- 日期选择 -->
	<template v-else-if="formItem.searchType == 'date'">
		<el-date-picker
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			value-format="YYYY-MM-DD"
			type="date"
			placeholder="请选择日期"
			:clearable="clearable(formItem)"
		/>
	</template>
	<!-- 时间范围选择 -->
	<template v-else-if="formItem.searchType == 'timerange'">
		<el-time-picker
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			is-range
			value-format="HH:mm:ss"
			range-separator="至"
			start-placeholder="开始时间"
			end-placeholder="结束时间"
			:clearable="clearable(formItem)"
		/>
	</template>
	<!-- 日期范围选择 -->
	<template v-else-if="formItem.searchType == 'daterange'">
		<el-date-picker
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			type="daterange"
			value-format="YYYY-MM-DD"
			range-separator="至"
			start-placeholder="开始时间"
			end-placeholder="结束时间"
			:clearable="clearable(formItem)"
		/>
	</template>
	<!-- 日期时间范围选择 -->
	<template v-else-if="formItem.searchType == 'datetimerange'">
		<el-date-picker
			v-model="searchParam[formItem.prop!]"
			v-bind="formItem.searchElComponentProps"
			type="datetimerange"
			value-format="YYYY-MM-DD HH:mm:ss"
			range-separator="至"
			start-placeholder="开始时间"
			end-placeholder="结束时间"
			:clearable="clearable(formItem)"
		/>
	</template>
</template>

<script setup lang="ts" name="searchFormItem">
import type { ColumnProps } from "@/components/ProTable/interface";

interface SearchFormItem {
	formItem: Partial<ColumnProps>; // 具体每一个搜索项的配置
	searchParam: any; // 搜索参数
}

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = (item: Partial<ColumnProps>) => {
	return item.searchInitParam == null || item.searchInitParam == undefined;
};

defineProps<SearchFormItem>();
</script>
