import type { KeepAliveState } from "@/store/interface";
import { defineStore } from "pinia";

// KeepAliveStore
export const KeepAliveStore = defineStore({
	id: "keepAliveStore",
	state: (): KeepAliveState => ({
		// 当前缓存的 routerName ==> 不做持久化
		keepLiveName: []
	}),
	getters: {},
	actions: {
		// add KeepLiveName
		async addKeepLiveName(name: string) {
			!this.keepLiveName.includes(name) && this.keepLiveName.push(name);
		},
		// remove KeepLiveName
		async removeKeepLiveName(name: string) {
			this.keepLiveName = this.keepLiveName.filter(item => item !== name);
		},
		// Set KeepAliveName
		async setKeepAliveName(keepLiveName: string[] = []) {
			this.keepLiveName = keepLiveName;
		}
	}
});
