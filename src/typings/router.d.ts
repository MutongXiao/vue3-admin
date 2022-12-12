/* eslint-disable no-unused-vars */

// typings.d.ts or router.ts
import "vue-router";

declare module "vue-router" {
	interface RouteMeta {
		icon?: string;
		title?: string;
		activeMenu?: string;
		isLink?: string;
		isHide?: boolean;
		isFull?: boolean;
		isAffix?: boolean;
		isKeepAlive?: boolean;
	}
}
