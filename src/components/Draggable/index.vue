<template>
	<div ref="draggableContainer">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from "vue";
import Sortable from "sortablejs";

const props = defineProps({
	modelValue: {
		type: Array as PropType<any[]>,
		default: () => []
	},
	options: {
		type: Object as PropType<Sortable.Options>,
		default: () => {}
	}
});

interface EmitsType {
	(e: "update:model-value", value: any[]): void;
}

const emit = defineEmits<EmitsType>();

const draggableContainer = ref<HTMLDivElement>();
const initDraggable = () => {
	if (!draggableContainer.value) return;
	Sortable.create(draggableContainer.value, {
		animation: 300,
		onUpdate: e => {
			if (!props.modelValue.length) return;
			if (e.oldIndex !== undefined && e.newIndex !== undefined) {
				// 从0截取到最后，备份一份
				const list = props.modelValue.slice(0);
				// 删除拖拽的元素
				const item = list.splice(e.oldIndex, 1)[0];
				//从 newIndex截 0个，用第三个参数 item 替换，也就是把删除的元素放在新的位置，
				list.splice(e.newIndex, 0, item);
				emit("update:model-value", list);
			}
			console.log(e);
		},
		...props.options
	});
};
onMounted(() => {
	initDraggable();
});
</script>

<style scoped lang="scss"></style>
