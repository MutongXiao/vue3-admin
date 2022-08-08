<template>
	<el-dialog v-model="visiable" title="修改密码" width="500px" draggable>
		<span>This is Password</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visiable = false">取消</el-button>
				<el-button @click="visiable = false" type="primary">确认</el-button>
			</span>
		</template>
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
