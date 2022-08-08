<template>
	<el-container>
		<el-aside>
			<Menu></Menu>
		</el-aside>
		<el-container>
			<el-header>
				<Header></Header>
			</el-header>
			<el-main>
				<section class="main-box">
					<router-view v-slot="{ Component, route }">
						<transition appear name="fade-transform" mode="out-in">
							<component :is="Component" :key="route.path"></component>
						</transition>
					</router-view>
				</section>
			</el-main>
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
import Menu from "./menu/index.vue";
import Header from "./header/index.vue";
import Footer from "./footer/index.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
