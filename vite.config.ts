import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig, loadEnv, type UserConfig, type ConfigEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import eslintPlugin from "vite-plugin-eslint";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
// import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import importToCDN from "vite-plugin-cdn-import";
import Inspect from "vite-plugin-inspect";

import { wrapperEnv } from "./src/utils/getEnv";

//const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	// 取出加载到的env对象， 里面包含env信息
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	return {
		plugins: [
			vue(),
			// * vite 可以使用 jsx/tsx 语法
			vueJsx(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			//用于生成 svg 雪碧图. 通过插件封装 SvgIcon 组件
			createSvgIconsPlugin({
				// 指定需要缓存的图标文件夹
				iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
				// 指定symbolId格式
				symbolId: "icon-[dir]-[name]"
				/**
				 * 自定义插入位置
				 * @default: body-last
				 */
				// inject?: 'body-last' | 'body-first'

				/**
				 * custom dom id
				 * @default: __svg__icons__dom__
				 */
				// customDomId: '__svg__icons__dom__',
			}),
			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// * name 可以写在 script 标签上
			VueSetupExtend(),
			// * demand import element(如果使用了cdn引入,没必要使用element自动导入了)
			// AutoImport({
			// 	// Auto import functions from Vue, e.g. ref, reactive, toRef...
			// 	// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
			// 	imports: ["vue"],
			// 	// Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
			// 	// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
			// 	resolvers: [ElementPlusResolver()],
			// 	dts: path.resolve(pathSrc, "auto-imports.d.ts")
			// }),
			// Components({
			// 	resolvers: [
			// 		// Auto register Element Plus components
			// 		// 自动导入 Element Plus 组件。如果启用该配置项，可以在main.ts关闭Element Plus的全局注册
			// 		ElementPlusResolver()
			// 	],

			// 	dts: path.resolve(pathSrc, "components.d.ts")
			// }),
			// * cdn 引入（vue、element-plus）
			importToCDN({
				modules: [
					// vue按需引入会导致依赖vue的插件出现问题(列如:pinia/vuex)
					// {
					// 	name: "vue",
					// 	var: "Vue",
					// 	path: "https://unpkg.com/vue@next"
					// },
					// 使用cdn引入element-plus时,开发环境还是需要在main.js中引入element-plus,可以不用引入css
					// {
					// 	name: "element-plus",
					// 	var: "ElementPlus",
					// 	path: "https://unpkg.com/element-plus",
					// 	css: "https://unpkg.com/element-plus/dist/index.css"
					// }
				]
			}),
			// * 是否生成包预览
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress 是否开启gzip压缩
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				}),
			// 检查 Vite 插件的中间件状态, 看到每个插件的时间消耗, 这样就可以找到最慢的那个了,用于调试和创作插件。
			Inspect()
		],
		//es 校验构建，是否删除生产环境 console 和 debugger
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
			}
		},
		// global css 变量注入
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "@/styles/var.scss";`
				}
			}
		},
		server: {
			host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: viteEnv.VITE_PORT, // 启动端口
			open: viteEnv.VITE_OPEN, // 自动打开浏览器
			cors: true,
			proxy: {
				"^/api": {
					// target: 代理目标地址
					// target: "https://www.fastmock.site/mock/f81e8333c1a9276214bcdbc170d9e0a0", // fastmock
					// target: "https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e",
					target: "https://mock.mengxuegu.com/mock/62f8303bf2652f239bd0a859",
					// 兼容基于名字的虚拟主机
					// a.com => localhost:xxx
					// b.com => localhost:xxx
					// HTTP 请求头部的 origin 字段
					// 我们在开发模式：默认的 origin 是真实的 origin: localhost:3000
					// changeOrigin: true, 代理服务会把 origin 修改为目标地址 http://jsonplaceholder.typicode.com
					changeOrigin: true,
					// 路径重写
					rewrite: path => path.replace(/^\/api/, "")
				}
			}
		},
		// build configure 打包输出配置
		build: {
			outDir: "dist",
			// esbuild 打包更快，但是不能去除 console.log
			minify: "esbuild",
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
