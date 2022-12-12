/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import type { Directive, DirectiveBinding } from "vue";
import { ElMessage } from "element-plus";

// 获取选定文本
const getSelectedText = () => window.getSelection()?.toString();
// clipboard API 所有操作都是异步的，不会造成页面卡顿，它可以将任意内容（如图片）放入剪贴板
const copyText = async (text: string) => await navigator.clipboard.writeText(text);

interface Eltype extends HTMLElement {
	copyData: string | number;
}

const copy: Directive = {
	mounted: (el: Eltype, binding: DirectiveBinding) => {
		el.copyData = binding.value;
		el.addEventListener("click", handleClick);
	},
	updated: (el: Eltype, binding: DirectiveBinding) => {
		el.copyData = binding.value;
	},
	beforeUnmount(el: Eltype) {
		el.removeEventListener("click", handleClick);
	}
};

async function handleClick(this: Eltype) {
	const input = document.createElement("input");
	input.value = this.copyData.toLocaleString();
	document.body.appendChild(input);
	input.select();
	// 调用 document.execCommand 复制命令，该API已不推荐
	// document.execCommand("Copy");
	const text = getSelectedText();
	document.body.removeChild(input);
	if (!text) return;
	await copyText(text);
	ElMessage({
		type: "success",
		message: "复制成功"
	});
}

export default copy;
