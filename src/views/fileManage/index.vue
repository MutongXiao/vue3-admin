<template>
	<el-table :data="tableData" style="width: 100%" height="100%" :header-row-style="rowHeader" :row-style="rowStyle">
		<el-table-column fixed label="" width="100">
			<template #default="scope">
				<el-icon style="width: 100%; text-align: center" @click.prevent="deleteRow(scope.$index)"><More /></el-icon>
			</template>
		</el-table-column>
		<el-table-column label="文件名称" width="400">
			<template #default="{ row }: { row: TableRowData }">
				<v-icon :name="row.isDirectory ? fileIcons['directory'] : fileIcons[row.type] ?? fileIcons['other']" />
				<span style="margin-left: 10px">{{ row.fileName }}</span>
			</template>
		</el-table-column>
		<el-table-column prop="size" label="大小" width="160" />
		<el-table-column prop="creator" label="创建人" width="140" />
		<el-table-column prop="date" label="创建时间" />
	</el-table>
	<!-- <el-button class="mt-4" style="width: 100%" @click="onAddItem">新增</el-button> -->
</template>

<script lang="ts" setup>
import { ref } from "vue";

const fileIcons: Record<string, string> = {
	directory: "fc-folder",
	doc: "vi-file-type-word",
	docx: "vi-file-type-word",
	xls: "vi-file-type-excel",
	xlsx: "vi-file-type-excel",
	ppt: "vi-file-type-powerpoint",
	pptx: "vi-file-type-powerpoint",
	mp4: "vi-file-type-video",
	wmv: "vi-file-type-video",
	asf: "vi-file-type-video",
	asx: "vi-file-type-video",
	rm: "vi-file-type-video",
	rmvb: "vi-file-type-video",
	"3gp": "vi-file-type-video",
	mov: "vi-file-type-video",
	m4v: "vi-file-type-video",
	avi: "vi-file-type-video",
	dat: "vi-file-type-video",
	vob: "vi-file-type-video",
	flv: "vi-file-type-video",
	mkv: "vi-file-type-video",
	mp3: "vi-file-type-audio",
	wma: "vi-file-type-audio",
	wav: "vi-file-type-audio",
	ape: "vi-file-type-audio",
	flac: "vi-file-type-audio",
	ogg: "vi-file-type-audio",
	aac: "vi-file-type-audio",
	jpeg: "vi-file-type-image",
	tiff: "vi-file-type-image",
	png: "vi-file-type-image",
	gif: "vi-file-type-image",
	jpg: "vi-file-type-image",
	webp: "vi-file-type-image",
	bmp: "vi-file-type-image",
	psd: "vi-file-type-photoshop2",
	pdf: "vi-file-type-pdf",
	txt: "vi-file-type-text",
	other: "vi-default-file",
	json: "vi-file-type-json"
};
type TableRowData = {
	date: string;
	fileName: string;
	isDirectory: boolean;
	creator: string;
	size: string | null;
	type: string;
};
const tableData = ref<TableRowData[]>([
	{
		date: "2016-05-01",
		fileName: "California",
		isDirectory: true,
		creator: "Tom",
		size: null,
		type: ""
	},
	{
		date: "2016-05-01",
		fileName: "California",
		isDirectory: true,
		creator: "Tom",
		size: null,
		type: ""
	},
	{
		date: "2016-05-01",
		isDirectory: false,
		fileName: "California.doc",
		creator: "Tom",
		size: "125mb",
		type: "doc"
	},
	{
		date: "2016-05-02",
		isDirectory: false,
		fileName: "California.ppt",
		creator: "Tom",
		size: "125mb",
		type: "ppt"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.xls",
		creator: "Tom",
		size: "125kb",
		type: "xls"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.png",
		creator: "Tom",
		size: "125kb",
		type: "png"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.mp3",
		creator: "Tom",
		size: "125kb",
		type: "mp3"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.mp4",
		creator: "Tom",
		size: "125kb",
		type: "mp4"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.pdf",
		creator: "Tom",
		size: "125kb",
		type: "pdf"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.psd",
		creator: "Tom",
		size: "125kb",
		type: "psd"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.txt",
		creator: "Tom",
		size: "125kb",
		type: "txt"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.json",
		creator: "Tom",
		size: "125kb",
		type: "json"
	},
	{
		date: "2016-05-03",
		isDirectory: false,
		fileName: "California.py",
		creator: "Tom",
		size: "125kb",
		type: "py"
	}
]);

const rowStyle = {
	cursor: "pointer",
	height: "50px"
};

const rowHeader = {
	height: "60px"
};

const deleteRow = (index: number) => {
	tableData.value.splice(index, 1);
};
</script>

<style scoped lang="scss">
.row-item {
	height: "50px";
	cursor: "pointer";
}
.row-header {
	height: "57px";
}
</style>
