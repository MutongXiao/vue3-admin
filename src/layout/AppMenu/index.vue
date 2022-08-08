<template>
	<el-menu
		:unique-opened="true"
		default-active="2"
		class="el-menu-vertical"
		background-color="#1b72dc"
		text-color="#ffffff"
		active-text-color="#ffd04b"
		:collapse="isCollapse"
		router
	>
		<el-menu-item index="/">
			<el-icon><HomeFilled /></el-icon>
			<template #title> 首页 </template>
		</el-menu-item>

		<el-sub-menu index="/product">
			<template #title>
				<el-icon><Shop /></el-icon>
				<span>商品</span>
			</template>
			<el-menu-item index="/product/product_list"> 商品列表 </el-menu-item>
			<el-menu-item index="/product/product_classify"> 商品分类 </el-menu-item>
			<el-menu-item index="/product/product_attr"> 商品规格 </el-menu-item>
			<el-menu-item index="/product/product_reply"> 商品评论 </el-menu-item>
		</el-sub-menu>

		<el-sub-menu index="/order">
			<template #title>
				<el-icon><ShoppingCart /></el-icon>
				<span>订单</span>
			</template>
			<el-menu-item index="/order/order_list"> 订单列表 </el-menu-item>
			<el-menu-item index="/order/order_offline"> 订单线下 </el-menu-item>
		</el-sub-menu>

		<el-menu-item index="/media">
			<el-icon><PictureFilled /></el-icon>
			<template #title> 媒体 </template>
		</el-menu-item>

		<el-sub-menu index="/permission">
			<template #title>
				<el-icon><Place /></el-icon>
				<span>权限</span>
			</template>
			<el-menu-item index="/permission/permission_admin"> 管理员 </el-menu-item>
			<el-menu-item index="/permission/permission_role"> 角色 </el-menu-item>
			<el-menu-item index="/permission/permission_rule"> 规则 </el-menu-item>
		</el-sub-menu>

		<el-sub-menu index="/setting">
			<template #title>
				<el-icon><Setting /></el-icon>
				<span>设置</span>
			</template>
			<el-sub-menu index="/setting/permission">
				<template #title>
					<el-icon><Setting /></el-icon>
					<span>权限管理</span>
				</template>
				<el-menu-item index="/setting/permission/admin">
					<el-icon><Menu /></el-icon>
					<template #title> 管理员 </template>
				</el-menu-item>
				<el-menu-item index="/setting/permission/role">
					<el-icon><Menu /></el-icon>
					<template #title> 角色 </template>
				</el-menu-item>
				<el-menu-item index="/setting/permission/rule">
					<el-icon><Menu /></el-icon>
					<template #title> 规则 </template>
				</el-menu-item>
			</el-sub-menu>
		</el-sub-menu>
	</el-menu>
</template>

<script lang="ts" setup>
import { Menu, Setting, Place, PictureFilled, ShoppingCart, Shop, HomeFilled } from "@element-plus/icons-vue";
import useStore from "@/stores";
import { storeToRefs } from "pinia";

const store = useStore();

// store 是一个用reactive 包裹的对象, 不能解构
// ❌ 这不起作用，因为它会破坏响应式, 这和从 props 解构是一样的
// const { isCollapse } = store;

// 为了从 Store 中提取属性同时保持其响应式，您需要使用storeToRefs()
const { isCollapse } = storeToRefs(store);
</script>

<style lang="scss" scoped>
.el-menu {
	height: 100%;
	border-right: none;
}
.el-menu:not(.el-menu--collapse) {
	width: 200px;
	min-height: 400px;
}
</style>
