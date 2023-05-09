// Define the fileData type
export interface RowData {
	_id: string; // 文件或文件夹id
	name: string; // 对于文件是url中非中文的文件名，或文件夹名
	fileName?: string; // 文件名
	url?: string; // 文件url
	type?: string; // 目录无文件类型
	size?: number; // 目录无文件大小
	owner: string; //文件所有者
	inFolderId: string; // 文件或文件夹所在目录id
	isFolder: boolean; // 文件是否是文件夹
	folderPath?: string; // 文件夹路径标识
	createdAt: string;
	updatedAt?: string;
}

export function getFileIcon(mimeType: string): string {
	if (
		mimeType === "application/msword" ||
		mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return "vi-file-type-word";
	}
	if (
		mimeType === "application/vnd.ms-excel" ||
		mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	) {
		return "vi-file-type-excel";
	}
	if (
		mimeType === "application/vnd.ms-powerpoint" ||
		mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
	) {
		return "vi-file-type-powerpoint";
	}
	if (mimeType === "text/javascript") {
		return "vi-file-type-light-js";
	}
	if (mimeType === "text/html") {
		return "vi-file-type-html";
	}
	if (mimeType === "text/css") {
		return "vi-file-type-css";
	}
	if (mimeType === "text/plain") {
		return "vi-file-type-text";
	}
	if (mimeType === "application/pdf") {
		return "vi-file-type-pdf";
	}
	if (mimeType === "application/json") {
		return "vi-file-type-json";
	}
	if (mimeType === "image/svg+xml") {
		return "vi-file-type-svg";
	}
	if (mimeType === "image/gif") {
		return "md-gif-sharp";
	}
	if (mimeType.includes("image/")) {
		return "vi-file-type-image";
	}
	if (mimeType.includes("audio/")) {
		return "vi-file-type-audio";
	}
	if (mimeType.includes("video/")) {
		return "vi-file-type-video";
	}
	return "vi-default-file";
}

// Define the function that takes in a folder ID and returns an array of its ancestors
export function getAncestors(folderId: string, files: RowData[]): RowData[] {
	const ancestors: RowData[] = []; // Initialize an empty array to store ancestors
	let currentFolder: RowData | undefined = files.find(file => file._id === folderId); // Find the current folder in the files array

	// 祖先链路包括自身节点
	currentFolder && ancestors.unshift(currentFolder);

	// Traverse up the directory tree until we reach the root folder (inFolderID is null)
	while (currentFolder && currentFolder.inFolderId) {
		const parentFolder = files.find(file => file._id === currentFolder!.inFolderId); // Find the parent folder
		if (parentFolder) {
			ancestors.unshift(parentFolder); // Add the parent folder to the beginning of the ancestors array
			currentFolder = parentFolder; // Set the current folder to the parent folder and continue traversing up
		} else {
			currentFolder = undefined; // If the parent folder is not found, stop traversing up
		}
	}

	return ancestors; // Return the array of ancestors
}
// 获取目录下的所有子节点
export function getFolderChildren(folderId: string, files: RowData[]): RowData[] {
	const children: RowData[] = [];
	files.forEach(file => {
		if (file.inFolderId === folderId) {
			file.isFolder ? children.unshift(file) : children.push(file);
		}
	});
	return children;
}
// 获取目录下的所有孙子节点
export function getGrandchildrenNodes(folderId: string, files: RowData[]): RowData[] {
	const childrenNodes = files.filter(file => file.inFolderId === folderId);

	const grandchildrenNodes = childrenNodes.reduce(
		(accumulated, childNode) =>
			accumulated.concat(childNode.isFolder ? getGrandchildrenNodes(childNode._id, files) : [childNode]),
		[] as RowData[]
	);

	return grandchildrenNodes;
}
// 计算文件大小
export function formatFileSize(byteSize: number): string {
	if (byteSize < 1024) {
		return byteSize + " B";
	} else if (byteSize < 1024 * 1024) {
		return (byteSize / 1024).toFixed(1) + " KB";
	} else if (byteSize < 1024 * 1024 * 1024) {
		return (byteSize / (1024 * 1024)).toFixed(1) + " MB";
	} else {
		return (byteSize / (1024 * 1024 * 1024)).toFixed(1) + " GB";
	}
}
