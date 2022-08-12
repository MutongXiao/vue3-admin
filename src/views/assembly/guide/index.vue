<template>
	<div class="content-box">
		<el-alert
			title="引导页对于用户第一次进入页面时很有用，可以对用户进行页面功能引导介绍。本 Demo 是基于 driver.js."
			type="warning"
			:closable="false"
		/>
		<br />
		<div id="Geeker"><el-button type="primary" @click.prevent.stop="guide">打开引导页 🤹‍♂️</el-button></div>
	</div>
</template>

<script setup lang="ts" name="guide">
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

const steps = [
	{
		element: "#collapseIcon",
		popover: {
			title: "Collapse Icon",
			description: "Open && Close sidebar",
			position: "right"
		}
	},
	{
		element: "#breadcrumb",
		popover: {
			title: "Breadcrumb",
			description: "Indicate the current page location",
			position: "right"
		}
	},
	{
		element: "#assemblySize",
		popover: {
			title: "Switch Assembly Size",
			description: "Switch the system size",
			position: "left"
		}
	},
	{
		element: "#language",
		popover: {
			title: "Switch Language",
			description: "Switch the system language",
			position: "left"
		}
	},
	{
		element: "#searchMenu",
		popover: {
			title: "Page Search",
			description: "Page search, quick navigation",
			position: "left"
		}
	},
	{
		element: "#theme",
		popover: {
			title: "Setting Layout",
			description: "Customize settings layout",
			position: "left"
		}
	},
	{
		element: "#fullscreen",
		popover: {
			title: "Full Screen",
			description: "Full Screen, Exit The Full Screen Page",
			position: "left"
		}
	}
];

const guide = () => {
	const driver = new Driver({
		allowClose: false,
		doneBtnText: "结束",
		closeBtnText: "关闭",
		nextBtnText: "下一步",
		prevBtnText: "上一步"
	});
	driver.defineSteps(steps);
	driver.start();
};
</script>

<style scoped lang="scss"></style>
