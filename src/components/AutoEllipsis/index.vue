<template>
	<div id="autoEllipsisWrapper" ref="containerRef" v-bind="$attrs">
		<span ref="textRef">
			<slot />
		</span>
	</div>
</template>
<script lang="ts" setup>
// 注意，对于非等宽字体，数字，字母，汉字，符号的宽度是不一样的，所以求平均值的得出的字符宽度不够精确，对于非等宽字体有省略号不居中的bug
import { ref, computed, nextTick, onBeforeUnmount } from "vue";
const props = withDefaults(
	defineProps<{
		identifierLocal?: "left" | "middle" | "right";
		maxDisplyLine?: number;
	}>(),
	{
		maxDisplyLine: 1,
		identifierLocal: "right"
	}
);
let premitiveText: string = "";
const containerRef = ref<HTMLDivElement>();
const textRef = ref<HTMLSpanElement>();
// 一行且省略符号不在中间显示，可以 css 处理
const cssEntirely = computed<boolean>(() => {
	return props.identifierLocal !== "middle" && props.maxDisplyLine === 1;
});
function autoElipsis() {
	const container = containerRef.value!;
	const textNode = textRef.value!;
	const str = premitiveText; // 拿到所有文字
	textNode.textContent = str; // 将所有文字放入到 span 标签
	container.style.whiteSpace = "nowrap"; // 容器设置文字在一行显示，为了计算宽度
	container.style.width = "fit-content"; // 容器设置 fit-content，就可以拿到正确的内容宽度
	const containerWidth = container.clientWidth; // 拿到了容器宽度

	const parent = container.parentElement; // 拿到父容器宽度
	const parentWidth = parent!.clientWidth || parent!.offsetWidth;
	if (containerWidth <= parentWidth) {
		console.log("autoElipsis", containerWidth, parentWidth);
		// 如果容器宽度小于父容器宽度，直接显示，不做处理
		textNode.textContent = str;
		return;
	} else if (cssEntirely.value) {
		// 单行显示，位于左侧或右侧。用 css 处理
		container.style.width = parentWidth + "px";
		container.style.whiteSpace = "nowrap";
		container.style.textOverflow = "ellipsis";
		container.style.overflow = "hidden";
		if (props.identifierLocal === "left") {
			container.style.direction = "rtl";
			textNode.style.direction = "ltr";
			textNode.style.unicodeBidi = "bidi-override";
			return;
		}
	} else {
		const textWidth = textNode.offsetWidth;
		const strNumer = str.length; // 文本长度
		const avgStrWidth = textWidth / strNumer; // 平均每个字符的长度
		// 根据父容器宽度，计算每行的可容纳的字符数
		const rowCharsNumber = Math.floor((parentWidth * props.maxDisplyLine) / avgStrWidth);
		const deleteCharsNumber = strNumer - rowCharsNumber + 1.5; // 算出要删除几个字符，1.5是为了省略号的宽度
		const delEachSidelength = deleteCharsNumber / 2; //因为要保留中间，所以不能从头删除，需要从两头删除
		const endLeft = Math.floor(strNumer / 2 - delEachSidelength); // 因为下面要用到slice，需要计算出 index
		const startRight = Math.ceil(strNumer / 2 + delEachSidelength); // 同上
		switch (props.identifierLocal) {
			case "middle": {
				// 截取中间的字符
				textNode.textContent = str.slice(0, endLeft) + "..." + str.slice(startRight);
				break;
			}
			case "right": {
				// 截取掉后面的字符
				textNode.textContent = str.slice(0, -deleteCharsNumber) + "...";
				break;
			}
			case "left": {
				// 截取掉前面的字符
				textNode.textContent = "..." + str.slice(0, deleteCharsNumber);
				break;
			}
		}
		container.style.wordBreak = "break-all";
		container.style.whiteSpace = "normal";
	}
}
// 创建大小变化监听器
const observer = new ResizeObserver(() => {
	autoElipsis();
});
nextTick(() => {
	premitiveText = textRef.value?.innerText ?? "";
	const app = document.getElementById("app");
	// 监听 app 大小
	observer.observe(app!);
});

onBeforeUnmount(() => {
	observer.disconnect();
});
</script>
