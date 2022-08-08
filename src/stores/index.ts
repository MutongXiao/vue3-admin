import { defineStore } from "pinia";

const useStore = defineStore("storeId", {
	// 推荐使用 完整类型推断的箭头函数
	state: () => {
		return {
			// 所有这些属性都将自动推断其类型
			isCollapse: false,
			isFullScreen: false
		};
	},

	actions: {
		toggleIsCallapse() {
			this.isCollapse = !this.isCollapse;
		}
	}
});

export default useStore;
