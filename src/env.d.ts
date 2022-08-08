/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	// 更多环境变量...
	readonly VITE_API_URL: string;
	readonly NODE_ENV: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
