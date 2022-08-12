<template>
	<el-dropdown>
		<div class="avatar">
			<img src="@/assets/images/avatar.gif" alt="avatar" />
		</div>
		<template #dropdown>
			<el-dropdown-menu v-if="!globalStore.token">
				<el-dropdown-item @click="router.push('/login')">{{ $t("header.logoin") }}</el-dropdown-item>
			</el-dropdown-menu>
			<el-dropdown-menu v-else>
				<el-dropdown-item @click="openDialog('proficRef')">{{ $t("header.personalData") }}</el-dropdown-item>
				<el-dropdown-item @click="openDialog('passwordRef')">{{ $t("header.changePassword") }}</el-dropdown-item>
				<el-dropdown-item @click="logout" divided>{{ $t("header.logout") }}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<!-- ProficDialog -->
	<ProficDialog ref="proficRef"></ProficDialog>
	<!-- passwordDialog -->
	<PasswordDialog ref="passworRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import PasswordDialog from "./PasswordDialog.vue";
import ProficDialog from "./ProficDialog.vue";
import { useRouter } from "vue-router";
import { GlobalStore } from "@/store";
import { MenuStore } from "@/store/modules/menu";
import { TabsStore } from "@/store/modules/tabs";
import { AuthStore } from "@/store/modules/auth";

const router = useRouter();
const globalStore = GlobalStore();
const menuStore = MenuStore();
const tabsStore = TabsStore();
const authStore = AuthStore();

//退出登录
const logout = () => {
	ElMessageBox.confirm("您是否确认退出登录?", "温馨提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(() => {
			router.push({ name: "login" });
			globalStore.setToken("");
			menuStore.$reset();
			tabsStore.$reset();
			authStore.$reset();
			ElMessage({
				type: "success",
				message: "退出登录成功！"
			});
		})
		.catch(() => {
			return;
		});
};

interface DialogExpose {
	openDialog: () => void;
}
const proficRef = ref<DialogExpose | null>(null);
const passworRef = ref<DialogExpose | null>(null);

// 点击头像选项，打开对应的对话框
const openDialog = (openWho: "proficRef" | "passwordRef") => {
	if (openWho === "proficRef") return proficRef.value?.openDialog();
	passworRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
@import "../../index.scss";
</style>
