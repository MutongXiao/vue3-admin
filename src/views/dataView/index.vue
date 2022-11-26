<template>
	<div v-for="(item, index) in data" :key="index">
		{{ item }}
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const data = ref<number[]>([]);

function generateData() {
	const data: number[] = [];
	for (let i = 0; i <= 10; i++) {
		data.push(Math.floor(Math.random() * 100));
	}
	return data;
}

onMounted(() => {
	data.value = generateData();
});
</script>

<style scoped>
.screem-container {
	display: flex;
	justify-content: space-between;
}
</style>
