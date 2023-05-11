<template>
	<!-- 路由页面跳转动画使用了 <transition>，只能用于单元素/组件之上。所以要包裹一个div -->
	<div class="file-page-container">
		<div class="folders-nav-wrapper">
			<div class="nav-folder">
				<FolderNavigation :files="allFiles" :current-folder-id="currentFolderId" @click="setcurrentFolderId" />
			</div>
			<el-button type="primary" @click="uploadFile(currentFolderId)">
				<el-icon class="el-icon--left" :size="17"><Upload /></el-icon>上传
			</el-button>
			<el-button type="primary" @click="addFolder(currentFolderId)">
				<el-icon class="el-icon--left" :size="17"><FolderAdd /></el-icon>新建文件夹
			</el-button>
		</div>
		<input ref="uploadRef" type="file" class="file-upload" @change="onUploadChange" />
		<el-table
			:data="displayFiles"
			class="file-table"
			:header-row-style="rowHeaderStyle"
			:row-style="rowStyle"
			v-loading="tableLoading"
			element-loading-background="rgba(122, 122, 122, 0.8)"
			element-loading-text="Loading..."
		>
			<el-table-column fixed width="100">
				<template #default="{ row }: { row: RowData }">
					<el-dropdown trigger="click" class="file-operator-cell">
						<el-button :icon="More" size="small" />
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item :icon="Edit" @click="renameFile(row)">重命名</el-dropdown-item>
								<el-dropdown-item v-if="row.isFolder" :icon="Upload" @click="uploadFile(row._id)">上传</el-dropdown-item>
								<el-dropdown-item v-if="!row.isFolder" :icon="Download" @click="downloadFile(row)">下载</el-dropdown-item>
								<el-dropdown-item :icon="DocumentCopy" @click="copyFile(row)">复制</el-dropdown-item>
								<el-dropdown-item :icon="Rank" @click="showMoveOperationDialog(row)">移动</el-dropdown-item>
								<el-dropdown-item
									v-if="operationFile.action === 'copy' && row.isFolder && operationFile.data?._id !== row._id"
									:icon="CopyDocument"
									@click="pasteFile(row._id)"
								>
									粘贴
								</el-dropdown-item>
								<el-dropdown-item :icon="Delete" @click="deleteFileOrFolder(row)">删除</el-dropdown-item>
								<el-dropdown-item v-if="!row.isFolder" :icon="Share">分享</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</template>
			</el-table-column>
			<el-table-column label="文件名称" width="400">
				<template #default="{ row }: { row: RowData }">
					<div class="file-name-cell" @click="clickFile(row)">
						<v-icon style="width: 25px; height: 25px" :name="row.isFolder ? 'fc-folder' : getFileIcon(row.type!)" />
						<span class="ellipsis">
							<bdi>{{ row.fileName ?? row.name }}</bdi>
						</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="大小" width="160">
				<template #default="scope">
					{{ scope.row.size ? formatFileSize(scope.row.size) : "" }}
				</template>
			</el-table-column>
			<el-table-column prop="owner" label="创建人" width="140" />
			<el-table-column prop="createdAt" label="创建时间" />
			<template #empty>
				<el-empty :image-size="200" description="空文件夹" />
			</template>
		</el-table>
		<MoveFileDialog
			ref="moveDialog"
			:files="allFiles"
			@move="moveFileOrFolder"
			@cancel="clearOperationFile"
			@close="clearOperationFile"
		/>
		<FilePreview ref="filePreview" />
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { More, DocumentCopy, Delete, Edit, Upload, Share, CopyDocument, Rank, Download } from "@element-plus/icons-vue";
import axios from "axios";

import { GlobalStore } from "@/store";
import { getFolderChildren, formatFileSize, getFileIcon, type RowData } from "./index";
import FolderNavigation from "./components/FolderNavigation.vue";
import MoveFileDialog from "./components/MoveFileModal.vue";
import FilePreview from "./components/FilePreview.vue";

const allFiles = ref<RowData[]>([]);
const operationFile = reactive<{ data: RowData | null; action: "copy" | "move" | null }>({
	data: null,
	action: null
});
const currentFolderId = ref<string>("/");
const moveDialog = ref();
const filePreview = ref();
const uploadRef = ref<HTMLInputElement>();
const tableLoading = ref(false);
const globalStore = GlobalStore();
const username = computed(() => globalStore.userInfo);
const displayFiles = computed<RowData[]>(() => getFolderChildren(currentFolderId.value, allFiles.value));

const rowStyle = {
	cursor: "pointer",
	height: "50px"
};
const rowHeaderStyle = {
	height: "60px"
};
// 清空当前操作文件
const clearOperationFile = () => {
	operationFile.action = null;
	operationFile.data = null;
};
// 获取文件和文件夹列表
const getRowDataData = async () => {
	tableLoading.value = true;
	const result = await Promise.all([
		axios.post("https://8izjs7cybn.hk.aircode.run/folder", { action: "get" }),
		axios.post("https://8izjs7cybn.hk.aircode.run/file", { action: "get" })
	]);
	allFiles.value = [...result[0].data?.data, ...result[1].data?.data];
	tableLoading.value = false;
};
// 上传文件
let seletedUploadFolderId = "/";
const uploadFile = (folderId: string) => {
	const uploadElement = uploadRef.value;
	seletedUploadFolderId = folderId;
	uploadElement?.click();
};
const onUploadChange = () => {
	const files = uploadRef.value!.files;
	// Get the first file selected
	const file = files && files[0];
	if (file) {
		const loading = ElLoading.service({
			lock: true,
			text: "Loading",
			background: "rgba(0, 0, 0, 0.7)"
		});
		// Create the data to post
		const formData = new FormData();
		// Then append the file to it
		formData.append("uploadFile", file);
		formData.append("inFolderId", seletedUploadFolderId);
		formData.append("fileName", file.name);
		formData.append("owner", username.value);
		formData.append("action", "upload");
		axios
			.post("https://8izjs7cybn.hk.aircode.run/file", formData)
			.then(res => {
				ElMessage({
					message: "上传成功.",
					type: "success"
				});
				const file = res.data.data as RowData;
				allFiles.value.push(file);
			})
			.catch(error => {
				if (error.response) {
					const message = error.response.data.message ?? "Failed with errors";
					ElMessage.error(message);
					console.log("Failed with errors:", error.response.data);
				} else {
					ElMessage.error(error.message);
					console.log("Error", error.message);
				}
			})
			.finally(() => {
				loading.close();
			});
	}
};
// 下载文件
const downloadFile = (file: RowData) => {
	// axios({
	// 	url: file.url,
	// 	method: "GET",
	// 	responseType: "blob" // Important
	// }).then(response => {
	// 	// Trigger browser to save data to file as if it was downloaded
	// 	// fileDownload(response.data, file.fileName!);
	// 	const mime = file.type!;
	// 	const blob = new Blob([response.data], { type: mime });
	// 	// 兼容IE不支持createObjectURL方法
	// 	if ("msSaveOrOpenBlob" in navigator) {
	// 		return window.navigator.msSaveOrOpenBlob(blob, file.fileName!);
	// 	}
	// 	//转换为 blob string
	// 	const blobUrl = window.URL.createObjectURL(blob); //blob:http://localhost:8000/59f8792c-c863-4bcc-b891-6fedb25e29bd

	// 	//然后我们创建a标签
	// 	const tempLink = document.createElement("a");
	// 	tempLink.style.display = "none";
	// 	tempLink.href = blobUrl;
	// 	//设置下载属性，点击后触发浏览器下载
	// 	tempLink.setAttribute("download", file.fileName!);
	// 	document.body.appendChild(tempLink);
	// 	//触发点击事件
	// 	tempLink.click();
	// 	//触发下载之后清掉
	// 	setTimeout(() => {
	// 		URL.revokeObjectURL(blobUrl);
	// 		document.body.removeChild(tempLink);
	// 	});
	// });

	const fileSrc = file.url ?? "";
	// 原来的url会跨域，走代理url
	const prosyUrl = "/download/" + fileSrc.replace("https://zj52bg.hk.aircodecdn.com/", "");
	fetch(prosyUrl)
		.then(response => {
			return response.blob();
		})
		.then(blob => {
			const blobUrl = window.URL.createObjectURL(blob);
			const tempLink = document.createElement("a");
			tempLink.style.display = "none";
			tempLink.href = blobUrl;
			tempLink.setAttribute("download", file.fileName!);
			document.body.appendChild(tempLink);
			tempLink.click();
			setTimeout(() => {
				URL.revokeObjectURL(blobUrl);
				document.body.removeChild(tempLink);
			});
		});
};
// 新建文件夹
const addFolder = (inFolderId: string) => {
	ElMessageBox.prompt("文件夹名称", "新建文件夹", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		inputValue: "",
		inputValidator: value => {
			// 返回 false 或 String 表示验证失败, 返回的字符串将用作 inputErrorMessage
			if (value.trim().length === 0) {
				return "文件夹名称不能为空";
			}
			return true;
		},
		inputErrorMessage: "文件名不合法"
	})
		.then(({ value }) => {
			const folder = {
				owner: "admin",
				name: value,
				inFolderId: inFolderId
			};
			axios
				.post("https://8izjs7cybn.hk.aircode.run/folder", {
					action: "add",
					folder: folder
				})
				.then(res => {
					ElMessage({
						message: "创建成功.",
						type: "success"
					});
					const folder = res.data.data as RowData;
					allFiles.value.push(folder);
				})
				.catch(error => {
					if (error.response) {
						const message = error.response.data.message ?? "Failed with errors";
						ElMessage.error(message);
						console.log("Failed with errors:", error.response.data);
					} else {
						ElMessage.error(error.message);
						console.log("Error", error.message);
					}
				});
		})
		.catch(() => {});
};
// 文件点击操作
const clickFile = (file: RowData) => {
	if (file.isFolder) {
		currentFolderId.value = file._id;
		return;
	}
	filePreview.value.open(file);
};
// 删除操作
const deleteFileOrFolder = (rowData: RowData) => {
	if (!rowData.isFolder) {
		axios
			.post("https://8izjs7cybn.hk.aircode.run/file", {
				action: "delete",
				deleteFiles: [{ _id: rowData._id }]
			})
			.then(async res => {
				if (res.data.isOk) {
					await getRowDataData();
					ElMessage({
						message: "删除文件成功.",
						type: "success"
					});
				} else {
					ElMessage.error(res.data.message);
				}
			})
			.catch(error => {
				if (error.response) {
					const message = error.response.data.message ?? "Failed with errors";
					ElMessage.error(message);
					console.log("Failed with errors:", error.response.data);
				} else {
					console.log("Error", error.message);
					ElMessage.error(error.message);
				}
			});
	} else {
		axios
			.post("https://8izjs7cybn.hk.aircode.run/folder", {
				action: "delete",
				folder: rowData
			})
			.then(async res => {
				if (res.data.isOk) {
					await getRowDataData();
					ElMessage({
						message: "删除文件夹成功.",
						type: "success"
					});
				} else {
					ElMessage.error(res.data.message);
				}
			})
			.catch(error => {
				if (error.response) {
					const message = error.response.data.message ?? "Failed with errors";
					ElMessage.error(message);
					console.log("Failed with errors:", error.response.data);
				} else {
					console.log("Error", error.message);
					ElMessage.error(error.message);
				}
			});
	}
};
// 复制 剪切操作
const copyFile = (file: RowData) => {
	operationFile.data = file;
	operationFile.action = "copy";
};
// 粘贴操作
const pasteFile = (inFolderId: string) => {
	// const pastFile = operationFile.data;
	// pastFile && (pastFile.inFolderId = inFolderId);
	clearOperationFile();
	console.log("inFolderId", inFolderId);
};
// 显示移动文件对话框
const showMoveOperationDialog = (rowData: RowData) => {
	operationFile.data = rowData;
	operationFile.action = "move";
	moveDialog.value.showDialog();
};
// 移动文件
const moveFileOrFolder = (inFolderId: string) => {
	if (operationFile.action === "move" && operationFile.data && !operationFile.data.isFolder) {
		axios
			.post("https://8izjs7cybn.hk.aircode.run/file", {
				action: "update",
				file: { ...operationFile.data, inFolderId }
			})
			.then(async res => {
				if (res.data.isOk) {
					await getRowDataData();
					ElMessage({
						message: "移动文件成功.",
						type: "success"
					});
					clearOperationFile();
				} else {
					ElMessage.error(res.data.message);
				}
			})
			.catch(error => {
				if (error.response) {
					const message = error.response.data.message ?? "Failed with errors";
					ElMessage.error(message);
					console.log("Failed with errors:", error.response.data);
				} else {
					console.log("Error", error.message);
					ElMessage.error(error.message);
				}
			});
	}
	if (operationFile.action === "move" && operationFile.data?.isFolder) {
		axios
			.post("https://8izjs7cybn.hk.aircode.run/folder", {
				action: "update",
				folder: { ...operationFile.data, inFolderId }
			})
			.then(async res => {
				if (res.data.isOk) {
					await getRowDataData();
					ElMessage({
						message: "移动文件夹成功.",
						type: "success"
					});
					clearOperationFile();
				} else {
					ElMessage.error(res.data.message);
				}
			})
			.catch(error => {
				if (error.response) {
					const message = error.response.data.message ?? "Failed with errors";
					ElMessage.error(message);
					console.log("Failed with errors:", error.response.data);
				} else {
					console.log("Error", error.message);
					ElMessage.error(error.message);
				}
			});
	}
};
// 修改文件名
const renameFile = (rowData: RowData) => {
	ElMessageBox.prompt("", "重命名：", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		inputValue: rowData.fileName ?? rowData.name,
		inputValidator: value => {
			// 返回 false 或 String 表示验证失败, 返回的字符串将用作 inputErrorMessage
			if (value.trim().length === 0) {
				return "文件名不能为空";
			}
			return true;
		},
		inputErrorMessage: "文件名不合法"
	})
		.then(({ value }) => {
			if (rowData.isFolder) {
				axios
					.post("https://8izjs7cybn.hk.aircode.run/folder", {
						action: "update",
						folder: { ...rowData, name: value }
					})
					.then(async res => {
						if (res.data.isOk) {
							ElMessage({
								message: res.data.message,
								type: "success"
							});
							rowData.name = value;
						} else {
							ElMessage.error(res.data.message);
						}
					})
					.catch(error => {
						if (error.response) {
							ElMessage.error("Failed with errors.");
							console.log("Failed with errors:", error.response.data);
						} else {
							console.log("Error", error.message);
							ElMessage.error(error.message);
						}
					});
			} else {
				axios
					.post("https://8izjs7cybn.hk.aircode.run/file", {
						action: "update",
						file: { ...rowData, fileName: value }
					})
					.then(async res => {
						if (res.data.isOk) {
							ElMessage({
								message: res.data.message,
								type: "success"
							});
							rowData.name = value;
						} else {
							ElMessage.error(res.data.message);
						}
					})
					.catch(error => {
						if (error.response) {
							ElMessage.error("Failed with errors.");
							console.log("Failed with errors:", error.response.data);
						} else {
							console.log("Error", error.message);
							ElMessage.error(error.message);
						}
					});
			}
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "已取消重命名"
			});
		});
};
// 修改当前打开文件夹 ID
const setcurrentFolderId = (folderId: string) => {
	currentFolderId.value = folderId;
};

onMounted(() => {
	getRowDataData();
});
</script>

<style scoped lang="scss">
.file-page-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	.folders-nav-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 35px 0;
		font-size: 14px;
		background-color: #ffffff;
		.nav-folder {
			flex: 1;
		}
	}
	.file-upload {
		display: none;
	}
	.file-table {
		flex: 1;
		width: 100%;
		.file-operator-cell {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
		}
		.file-name-cell {
			display: flex;
			align-items: center;
			font-size: 13px;
			color: #03081a;
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
</style>
