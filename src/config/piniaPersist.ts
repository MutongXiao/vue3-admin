import type { PersistedStateOptions } from "pinia-plugin-persistedstate";

/**
 * @description pinia持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @return persist
 * */
const piniaPersistConfig = (key: string, paths?: string[]) => {
	const persist: PersistedStateOptions = {
		key,
		storage: window.localStorage,
		// storage: window.sessionStorage,
		// 指定要持久化的数据，默认所有 state 都会进行缓存，
		// 可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
		// paths: ["curUsername"]
		paths
	};
	return persist;
};

export default piniaPersistConfig;
