<template>
	<div class="content-box">
		<el-button @click="addDomain" class="add" type="primary" plain>Add Input</el-button>
		<el-form ref="formRef" :model="dynamicValidateForm" label-width="100px" class="demo-dynamic">
			<el-form-item
				prop="email"
				label="Email"
				:rules="[
					{
						required: true,
						message: 'Please input email address',
						trigger: 'blur'
					},
					{
						type: 'email',
						message: 'Please input correct email address',
						trigger: ['blur', 'change']
					}
				]"
			>
				<el-input v-model="dynamicValidateForm.email" />
			</el-form-item>
			<el-form-item
				v-for="(domain, index) in dynamicValidateForm.domains"
				:key="domain.key"
				:label="'Domain-' + index"
				:prop="'domains.' + index + '.value'"
				:rules="{
					required: true,
					message: 'domain can not be null',
					trigger: 'blur'
				}"
			>
				<el-input v-model="domain.value">
					<template #append>
						<el-button @click="removeDomain(domain)" type="danger" plain class="mt-2">Delete</el-button>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
				<el-button @click="resetForm(formRef)">Reset</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="dynamicForm">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";

const formRef = ref<FormInstance>();
interface DomainItem {
	key: number;
	value: string;
}
const dynamicValidateForm = reactive<{
	domains: DomainItem[];
	email: string;
}>({
	domains: [
		{
			key: 1,
			value: ""
		}
	],
	email: ""
});

const addDomain = () => {
	dynamicValidateForm.domains.push({
		key: Date.now(),
		value: ""
	});
};

const removeDomain = (item: DomainItem) => {
	const index = dynamicValidateForm.domains.indexOf(item);
	if (index !== -1) {
		dynamicValidateForm.domains.splice(index, 1);
	}
};

const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (valid) {
			ElMessage.success("valid pass, do something");
		} else {
			ElMessage.error("error submit!");
			return false;
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
