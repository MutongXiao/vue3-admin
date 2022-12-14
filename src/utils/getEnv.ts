import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function isDevFn(mode: string) {
	return mode === "developemnt";
}

export function isProdFn(mode: string) {
	return mode === "production";
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
	const ret: any = {};
	// 遍历env 配置信息
	for (const envName of Object.keys(envConf)) {
		let realName = envConf[envName].replace(/\\n/g, "\n");
		realName = realName === "true" ? true : realName === "false" ? false : realName;

		if (envName === "VITE_PORT") {
			realName = Number(realName);
		}
		if (envName === "VITE_PROXY") {
			try {
				realName = JSON.parse(realName);
			} catch (error) {}
		}
		ret[envName] = realName;
		process.env[envName] = realName;
	}
	return ret;
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = "VITE_GLOB_", confFiles = [".env", ".env.production"]) {
	let envConfig = {};
	confFiles.forEach(item => {
		try {
			const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
			envConfig = { ...envConfig, ...env };
		} catch (error) {
			console.error(`Error in parsing ${item}`, error);
		}
	});

	Object.keys(envConfig).forEach(key => {
		const reg = new RegExp(`^(${match})`);
		if (!reg.test(key)) {
			Reflect.deleteProperty(envConfig, key);
		}
	});
	return envConfig;
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
	return path.resolve(process.cwd(), ...dir);
}
