<template>
	<template v-for="subItem in menuList" :key="subItem.path">
		<el-sub-menu v-if="subItem.children && subItem.children.length > 0" :index="subItem.path">
			<template #title>
				<el-icon>
					<component :is="subItem.meta.icon" />
				</el-icon>
				<span>{{ subItem.meta.title }}</span>
			</template>
			<SubMenu :menuList="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path" @click="handleMenuClick(subItem)">
			<el-icon>
				<component :is="subItem.meta.icon"></component>
			</el-icon>
			<template #title>
				<span>{{ subItem.meta.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{ menuList: Menu.MenuOptions[]; clickCall?: () => void }>();
const emits = defineEmits<{ (e: "clickCall"): void }>();

const router = useRouter();

const handleMenuClick = (subItem: Menu.MenuOptions) => {
	// 在父组件中，通过 @clickCall 监听子组件自定义事件的方式，触发父组件去调用 clickCall 方法
	emits("clickCall"); // 向父组件发出触发自定义事件监听函数的调用通知
	// 在父组件中，通过 :clickCall 传递 props的方式，来在子组件中调用父组件中 clickCall 方法
	props.clickCall && props.clickCall();
	console.log("props.clickCall", props.clickCall);
	if (subItem.meta.isLink) {
		return window.open(subItem.meta.isLink, "_blank");
	}
	router.push(subItem.path);
};
</script>
