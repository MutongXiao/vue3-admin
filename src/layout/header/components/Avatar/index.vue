<template>
	<el-dropdown>
		<div class="avatar">
			<img src="@/assets/images/avatar.gif" alt="avatar" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="openDialog('proficRef')">{{ $t("header.personalData") }}</el-dropdown-item>
				<el-dropdown-item @click="openDialog('passwordRef')">{{ $t("header.changePassword") }}</el-dropdown-item>
				<el-dropdown-item divided>{{ $t("header.logout") }}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<!-- ProficDialog -->
	<ProficDialog ref="proficRef"></ProficDialog>
	<!-- passwordDialog -->
	<PasswordDialog ref="passworRef"></PasswordDialog>
</template>

<script setup lang="ts">
import PasswordDialog from "./PasswordDialog.vue";
import ProficDialog from "./ProficDialog.vue";

interface DialogExpose {
	openDialog: () => void;
}

const proficRef = ref<DialogExpose | null>(null);
const passworRef = ref<DialogExpose | null>(null);
const openDialog = (openWho: "proficRef" | "passwordRef") => {
	if (openWho === "proficRef") return proficRef.value?.openDialog();
	passworRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
@import "../../index.scss";
</style>
