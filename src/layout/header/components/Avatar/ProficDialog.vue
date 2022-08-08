<template>
	<el-dialog v-model="visiable" title="个人资料" width="500px" draggable>
		<span>This is userInfo</span>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visiable = ref(false);

// openDialog
const openDialog = () => {
	visiable.value = true;
};
// setup 对外暴露数据，只能使用defineExpose暴露的数据
defineExpose({
	openDialog
});
</script>
