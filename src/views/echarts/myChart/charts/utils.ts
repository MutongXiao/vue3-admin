const utils = {
	extendsObj: (obj1: Record<string, any>, obj2: Record<string, any>) => {
		for (let k in obj2) {
			obj1[k] = obj2[k];
		}
		return obj1;
	},
	maxData: (arr: any[]) => {
		let newArr: number[] = [];
		arr.map(item => {
			newArr.push(item.yVal as number);
		});
		return Math.max.apply(null, newArr);
	}
};

export default utils;
