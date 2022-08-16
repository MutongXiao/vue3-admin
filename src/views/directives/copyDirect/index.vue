<template>
	<div class="content-box">
		<span class="text">复制指令 🍇🍇🍇🍓🍓🍓</span>
		<div class="box-content">
			<el-input placeholder="请输入内容" v-model="data" style="width: 500px">
				<template #append>
					<el-button v-copy="data">复制</el-button>
				</template>
			</el-input>
			<br />
			<br />
			<el-input v-model="textarea" :rows="2" type="textarea" placeholder="在此次粘贴(ctrl + v)" />
		</div>
	</div>
</template>

<script setup lang="ts" name="copyDirect">
import { ref } from "vue";

const data = ref<string>("点击复制按钮，这里的内容将被复制 🍒 🍉 🍊");
const textarea = ref("");
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
