<template>
	<div class="data-list">
		<div class="calc-list">
			<div class="calc-tip">选择表格的计算类型</div>
			<el-checkbox-group v-model="checkList">
				<el-checkbox v-for="item in calcList" :key="item.type" :label="item.title" />
			</el-checkbox-group>
			<el-select
				v-model="selectValue"
				placeholder="选择加权因子"
				:disabled="!checkList.includes('加权平均')"
				@change="selectChange"
			>
				<el-option v-for="item in selectOptions" :key="item.Alias" :label="item.title" :value="item.Alias" />
			</el-select>
		</div>
		<div class="table-list">
			<vxe-table
				ref="vxeTableRef"
				size="mini"
				height="auto"
				stripe
				border
				resizable
				show-overflow
				show-footer
				highlight-current-row
				highlight-hover-row
				show-header-overflow
				show-footer-overflow
				:data="tableBody"
				:merge-footer-items="footerItems"
				:footer-method="footerMethod"
			>
				<vxe-column
					v-for="item in tableHead"
					:field="item.Alias"
					:title="item.title"
					:key="item.Alias"
					:fixed="item.fixed ? 'left' : undefined"
					:width="item.width ? item.width : 150"
				/>
			</vxe-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from "vue";
import { headData, calcTypeListData, tableData } from "./tableData.js";
import type { TableDataType, CalcType, HeadType } from "./tableData.js";
import type { VxeTableInstance, VxeTablePropTypes } from "vxe-table";

// 已选计算类型的集合
const checkList = ref<string[]>([]);
const tableHead = ref(headData);
const tableBody = ref(tableData);
const calcList = ref(calcTypeListData);
// 加权因子
const selectValue = ref<string>("");
// 获取表头列的分类
const selectOptions = ref(headData.filter(item => item.Alias !== "key"));
// 存放所有的worker
const workerList = ref<Record<string, Worker>[]>([]);
const footerItems = ref([
	{ row: 0, col: 0, rowspan: 1, colspan: 1 },
	{ row: 1, col: 0, rowspan: 1, colspan: 1 },
	{ row: 2, col: 0, rowspan: 1, colspan: 1 },
	{ row: 3, col: 0, rowspan: 1, colspan: 1 },
	{ row: 4, col: 0, rowspan: 1, colspan: 1 },
	{ row: 5, col: 0, rowspan: 1, colspan: 1 },
	{ row: 6, col: 0, rowspan: 1, colspan: 1 },
	{ row: 7, col: 0, rowspan: 1, colspan: 1 },
	{ row: 8, col: 0, rowspan: 1, colspan: 1 },
	{ row: 9, col: 0, rowspan: 1, colspan: 1 },
	{ row: 10, col: 0, rowspan: 1, colspan: 1 },
	{ row: 11, col: 0, rowspan: 1, colspan: 1 }
]);
// 底部表尾统计的数据项，数据格式是一个二维数组
let footerData: string[][] = [];

const vxeTableRef = ref<VxeTableInstance>();

// 将表格数据按每个列进行统计;
const dataMap: Partial<Record<keyof TableDataType, (string | number)[]>> = {};
// 表尾的数据获取方法，返回一个二维数组，在该方法中触发统计计算
const footerMethod: VxeTablePropTypes.FooterMethod = () => {
	return footerData;
};

// 获取统计项发生变化 增加 or 减少（差集）
function getCalcChange() {
	// 获取表尾每行的第一项，即每行表尾计算项名称
	let footerList = footerData.map(item => item[0]).filter(item => item);
	let dif =
		checkList.value.length > footerList.length
			? checkList.value.filter(item => !footerList.includes(item))
			: footerList.filter(item => !checkList.value.includes(item));
	return {
		dif: dif[0], //当前操作的计算项名称
		isAdd: footerList.length > checkList.value.length ? false : true
	};
}

interface CalcInfoType {
	calcType: CalcType;
	columnList: HeadType[];
	dataMap: typeof dataMap;
	selectValue: string;
}
// 加权计算项，下拉选择事件
function selectChange(val: string) {
	makeWorker({
		calcType: toRaw(calcList.value.filter(item => item.title == "加权平均")[0]),
		columnList: toRaw(selectOptions.value),
		dataMap: dataMap,
		selectValue: val
	}).then(result => {
		footerData.forEach((data, index) => {
			if (data[0] === result[0]) {
				footerData.splice(index, 1, result); // 原位置替换
			}
		});
		vxeTableRef.value?.refreshColumn();
	});
}

// 将所有数据按每个列进行统计
function getDataMap() {
	selectOptions.value.forEach(item => {
		dataMap[item.Alias] = tableBody.value.map(val => val[item.Alias]);
	});
}

// 创建计算worker
function makeWorker(calcInfo: CalcInfoType) {
	return new Promise<string[]>((resolve, reject) => {
		// type: "module" 创建 “模块” worker 的选项, 因为calcListWorker.js中用到了import 语句
		const calcWorker = new Worker(new URL("../worker/calcListWorker.js", import.meta.url), {
			type: "module"
		});
		let workerName = `worker${workerList.value.length}`;
		let start = performance.now();
		calcWorker.postMessage(calcInfo);

		calcWorker.addEventListener("message", e => {
			calcWorker.terminate();
			if (e.data.isOk) {
				const result = e.data.data;
				let end = performance.now();
				let duration = end - start;
				console.log(`当前任务: ${result[0]}, 计算用时: ${duration} 毫秒`);
				resolve && resolve(result);
			} else {
				reject && reject("worker计算出错");
			}
		});

		workerList.value.push({ [workerName]: calcWorker });
	});
}

function clearWorker() {
	if (workerList.value.length) {
		workerList.value.forEach((item, index) => {
			item[`worker${index}`] && item[`worker${index}`].terminate(); // 终止所有线程
		});
	}
}
// 监听计算项复选框列表的勾选变化
watch(checkList, () => {
	if (checkList.value.length) {
		let { dif, isAdd } = getCalcChange();
		if (!isAdd) {
			// 取消对应的选项，删除对应统计项
			footerData.forEach((item, index) => {
				if (item[0] == dif) {
					footerData.splice(index, 1);
				}
			});
			vxeTableRef.value?.refreshColumn();
		} else {
			footerData.push([dif]);
			vxeTableRef.value?.refreshColumn();
			if (!(dif == "加权平均" && !selectValue.value)) {
				// toRow将响应式引用对象转普通对象数据，因为worker通讯数据不能克隆getter, setter之类的对象描述，详情查看MDN文档
				makeWorker({
					calcType: toRaw(calcList.value.filter(item => item.title === dif)[0]),
					columnList: toRaw(selectOptions.value),
					dataMap: dataMap,
					selectValue: selectValue.value // 此value不是引用对象，是个基本类型值，不需要toRow
				}).then(result => {
					footerData.forEach((data, index) => {
						if (data[0] === result[0]) {
							footerData.splice(index, 1, result); // 原位置替换
						}
					});
					vxeTableRef.value?.refreshColumn();
				});
			}
		}
	} else {
		footerData = [];
		vxeTableRef.value?.refreshColumn();
	}
	// 刷新列, footerMathod也会被触发执行
	// vxeTableRef.value?.refreshColumn();
	// 重新计算尾部统计数据，否则选择后数据不同步显示
	// vxeTableRef.value?.handleDefaultMergeFooterItems(); 该版本不存在此方法
	// footerMathod也会被触发执行,该方法不会渲染新添加的表尾项，只在已在页面渲染的表尾才会看到更新数据，
	// const footer = await vxeTableRef.value?.updateFooter();
	// console.log("footer", footer);
});

onMounted(() => {
	// 生成表格数据的worker
	const dataWorker = new Worker(new URL("../worker/generateDataWorker.js", import.meta.url));
	dataWorker.postMessage(tableData);
	dataWorker.addEventListener("message", e => {
		dataWorker.terminate();
		tableBody.value = tableBody.value.concat(e.data);
		getDataMap();
	});
});

onBeforeUnmount(() => {
	clearWorker();
});
</script>

<style scoped lang="scss">
.data-list {
	display: flex;
	width: 100%;
	height: calc(100vh - 60px);
	.calc-list {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 130px;
		background: #f2f6fc;
		.calc-tip {
			padding: 20px 0;
			font-size: 13px;
			font-weight: bold;
			text-align: center;
			background: #67c23a;
		}
		.el-checkbox-group {
			padding: 10px 10px 0;
			.el-checkbox {
				margin-bottom: 10px;
			}
		}
		.el-select {
			width: 110px;
			margin-left: 10px;
			.el-input__inner,
			.el-input__icon {
				height: 28px;
				font-size: 12px;
				line-height: 28px;
			}
			.el-input__inner {
				padding-left: 5px;
			}
		}
	}
	.table-list {
		flex: 1;
		height: 100%;
		overflow: hidden;
		.vxe-table {
			tfoot {
				background: #f2f6fc;
				tr {
					td {
						&:first-of-type {
							font-weight: bold;
							color: #409eff;
						}
					}
				}
			}
		}
	}
}
</style>
