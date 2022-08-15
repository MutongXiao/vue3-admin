import * as xlsx from "xlsx";

export const jsonToExcel = (options: {
	data: any[];
	header: Record<string, string>;
	fileName: string;
	bookType: xlsx.BookType;
}) => {
	// 创建一个工作簿 eorkbook
	const wb = xlsx.utils.book_new();
	// 如果有指定表头映射值
	if (options.header) {
		options.data = options.data.map(item => {
			const obj: Record<string, any> = {};
			for (const key in item) {
				if (options.header[key]) {
					obj[options.header[key]] = item[key];
				} else {
					obj[key] = item[key];
				}
			}
			return obj;
		});
	}
	// 创建一个工作表 worksheet
	const ws = xlsx.utils.json_to_sheet(options.data);
	// 把工作表放到工作簿中
	xlsx.utils.book_append_sheet(wb, ws);
	// 生成数据保存
	xlsx.writeFile(wb, options.fileName, {
		bookType: options.bookType || "xlsx"
	});
};
