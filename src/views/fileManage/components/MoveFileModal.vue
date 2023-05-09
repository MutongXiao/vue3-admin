<template>
	<el-dialog
		v-model="dialogVisible"
		class="dialog-wrapper"
		title="移动到"
		width="720px"
		:before-close="handleClose"
		destroy-on-close
	>
		<div class="nd-file-selector__nav">
			<FolderNavigation :files="files" :current-folder-id="currentFolderId" @click="setcurrentFolderId" />
		</div>
		<div class="nd-file-list-table">
			<table v-if="listFolders.length > 0" class="nd-table__body-table">
				<colgroup>
					<col width="100%" />
				</colgroup>
				<tbody v-for="folder in listFolders" :key="folder._id">
					<tr class="nd-table__body-row" @click="setcurrentFolderId(folder._id)">
						<td class="nd-table__td">
							<div class="nd-list-name">
								<v-icon style="width: 30px; height: 30px" name="fc-folder" />
								<span class="ellipsis">
									<bdi
										@mouseover="hoverFileName = true"
										@mouseleave="hoverFileName = false"
										:style="{ color: hoverFileName ? themColor : 'inherit' }"
									>
										{{ folder.name }}
									</bdi>
								</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<div v-else class="list-empty">
				<v-icon style="width: 75px; height: 75px" name="fc-folder" />
				<p>移动到 {{ currentFolder?.name || "更目录" }} 文件夹</p>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel" round>取消</el-button>
				<el-button type="primary" @click="handleMove" round> 移动到此 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { GlobalStore } from "@/store";
import { ElMessageBox } from "element-plus";

import type { RowData } from "../index";
import FolderNavigation from "./FolderNavigation.vue";

const globalStore = GlobalStore();
const dialogVisible = ref(false);
const hoverFileName = ref(false);
const currentFolderId = ref("/");
const currentFolder = computed(() => props.files.find(item => item._id === currentFolderId.value));
const themColor = computed(() => globalStore.themeConfig.primary);
const listFolders = computed(() => props.files.filter(file => file.isFolder && file.inFolderId === currentFolderId.value));

const props = defineProps<{ files: RowData[] }>();
const emits = defineEmits<{
	(e: "move", folderId: string): void;
	(e: "cancel"): void;
	(e: "close"): void;
}>();

const setcurrentFolderId = (folderId: string) => {
	currentFolderId.value = folderId;
};

const showDialog = () => {
	dialogVisible.value = true;
};

const hideDialog = () => {
	currentFolderId.value = "/";
	dialogVisible.value = false;
};

const handleClose = (done: () => void) => {
	ElMessageBox.confirm("确定关闭移动操作吗？")
		.then(() => {
			emits("close");
			done();
		})
		.catch(() => {
			// catch error
			console.log("取消关闭");
		});
};

const handleMove = () => {
	emits("move", currentFolderId.value);
	hideDialog();
};

const handleCancel = () => {
	emits("cancel");
	hideDialog();
};

defineExpose({
	showDialog
});
</script>
<style scoped lang="scss">
.nd-file-selector__nav {
	height: 40px;
	padding: 0 14px 0 24px;
	overflow: hidden;
	font-size: 12px;
	line-height: 40px;
	color: #afb3bf;
	background-color: #fafafc;
	border-bottom-width: 0;
	border-radius: 4px 4px 0 0;
}
.nd-file-list-table {
	height: calc(100% - 40px);
	overflow: auto;
	.list-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		p {
			margin-top: 10px;
			color: #afb3bf;
		}
	}

	// 禁止用户鼠标按住滑动选中
	user-select: none;
	&::-webkit-scrollbar {
		width: 6px;
		height: 10px;
	}
	&::-webkit-scrollbar-thumb,
	&::-webkit-scrollbar-thumb:hover {
		border-radius: 5px;
		box-shadow: inset 0 0 6px rgb(0 0 0 / 0%);
	}
	&::-webkit-scrollbar-thumb {
		background-color: rgb(85 85 85 / 40%);
	}
	&::-webkit-scrollbar-track {
		background: none;
		border-radius: 0;
	}
	.nd-table__body-table {
		width: 100%;
		color: #424e67;
		table-layout: fixed;
		.nd-table__body-row {
			height: 50px;
			font-size: 12px;
			line-height: 50px;
			color: #03081a;
			border-bottom: 1px solid #f9f9f9;
			&:hover {
				background-color: #f7f9fc;
				border-color: #f7f9fc;
			}
			.nd-table__td {
				position: relative;
				padding: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				cursor: pointer;
				.nd-list-name {
					display: flex;
					align-items: center;
					padding-left: 24px;
					pointer-events: all;
					cursor: pointer;
					.ellipsis {
						flex: 1;
						margin-left: 10px;
						overflow: hidden;
						text-align: end;
						text-overflow: ellipsis;
						white-space: nowrap;
						direction: rtl;
					}
				}
			}
		}
	}
}
.dialog-footer button {
	width: 100px;
}
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>

<style lang="scss">
.dialog-wrapper {
	border-radius: 12px;
	.el-dialog__header span {
		font-weight: 700;
	}
	.el-dialog__body {
		height: 340px;
		padding: 0;
	}
}
</style>
