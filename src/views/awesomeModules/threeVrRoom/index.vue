<template>
	<div ref="vrContainer" class="vr-container"></div>
</template>

<script setup lang="ts">
import iconImg from "./img/icon.png";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
//import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { onMounted, ref, onBeforeUnmount } from "vue";

const vrContainer = ref<HTMLDivElement>();
// 页面中的鼠标向量
const mouse = new THREE.Vector2();
// 场景
let scene: THREE.Scene;
// 相机
let camera: THREE.PerspectiveCamera;
// 渲染器
let renderer: THREE.WebGLRenderer;
// 轨迹控制器
let controls: TrackballControls;
// 投影射线。捕获鼠标位置
const raycaster = new THREE.Raycaster();
// 精灵材质
let sprite: THREE.Sprite;
let sixPlane: THREE.Mesh[];

function onMouseMove(event: MouseEvent) {
	// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	// mouse.x = (event.clientX / vrContainer.value!.clientWidth) * 2 - 1;
	// mouse.y = -(event.clientY / vrContainer.value!.clientHeight) * 2 + 1;
}
// 鼠标点击
function onMouseClick(event: MouseEvent) {
	event.preventDefault();
	// 通过摄像机和鼠标位置更新射线
	raycaster.setFromCamera(mouse, camera);
	// 计算物体和射线的焦点
	const intersects = raycaster.intersectObjects([sprite]);
	console.log("mouse", mouse);
	console.log("intersects", intersects);
	if (intersects.length > 0) {
		console.log(111);
		// 鼠标点中射线投射交汇出
		changeScene();
	}
}

function getStaticFile(url: string) {
	return new URL(url, import.meta.url).href;
}

function changeScene() {
	// 创建六个面
	const sixBox = createPlane(2);
	const timer = setInterval(() => {
		// 视角逐渐关闭，实现视觉切换
		camera.fov -= 1;
		// 更新摄像机的投影矩阵
		camera.updateProjectionMatrix();
		if (camera.fov == 20) {
			clearInterval(timer);
			camera.fov = 45;
			camera.updateProjectionMatrix();
			for (let i = 0; i < 6; i++) {
				scene.remove(sixPlane[i]);
			}
			sixPlane = sixBox;
			for (let i = 0; i < 6; i++) {
				scene.add(sixPlane[i]);
			}
			sprite.visible = false;
		}
	}, 50);
}

// 初始化渲染器
function initRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(vrContainer.value!.clientWidth, vrContainer.value!.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	vrContainer.value!.appendChild(renderer.domElement);
}
// 初始化场景
function initScene() {
	scene = new THREE.Scene();
	// 坐标轴辅助线
	const axesHelper = new THREE.AxesHelper(100);
	scene.add(axesHelper);
}
// 初始化相机
function initCamera() {
	camera = new THREE.PerspectiveCamera(45, vrContainer.value!.clientWidth / vrContainer.value!.clientHeight, 1, 1000);
	// 设置相机位置，使其位于内部
	camera.position.set(0, 0, 0.1);
	// 相机控件（轨迹球），必须在动画循环里调用.update()。
	controls = new TrackballControls(camera, renderer.domElement);
	// 从轨迹球鼠标滚动，最大观察距离（防止从空间内部滚出）
	controls.maxDistance = 5;
	// 从轨迹球鼠标滚动，最小观察距离 防止从空间内部滚出）
	controls.minDistance = 0;
}
// 初始化模型物体
function initMesh() {
	// 利用精灵材质引入地面标记
	new THREE.TextureLoader().load(iconImg, textture => {
		const spriteMaterial = new THREE.SpriteMaterial({
			map: textture
		});
		sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(0.1, 0.1, 0.1);
		sprite.position.set(0.5, -1, -1.5);
		scene.add(sprite);
	});
	// 创建一个空间球体
	// const geometry = new THREE.SphereGeometry(4, 32, 32);
	// const loader = new RGBELoader();
	// 加载的是全息图，不是6个面的拼接图
	// loader.load(getStaticFile("./img/hdr/Living.hdr"), texture => {
	// 	// 基础材质
	// 	const material = new THREE.MeshBasicMaterial({ map: texture });
	// 	// 材质与集合体集合创建空间网格
	// 	const sphere = new THREE.Mesh(geometry, material);
	// 	// 反转z轴，进入几何体内部
	// 	sphere.geometry.scale(1, 1, -1);
	// 	// 将空间体网格添加进场景
	// 	scene.add(sphere);
	// });

	// 创建6面空间
	// sixPlane = createPlane(0);
	// for (let i = 0; i < sixPlane.length; i++) {
	// 	scene.add(sixPlane[i]);
	// }

	// 添加6面立方体
	const geometry = new THREE.BoxGeometry(10, 10, 10);
	const arr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"];
	const boxMaterials: THREE.MeshBasicMaterial[] = [];
	arr.forEach(item => {
		// 纹理加载
		let texture = new THREE.TextureLoader().load(getStaticFile(`./img/living/${item}.jpg`));
		// 创建材质
		if (item === "4_u" || item === "4_d") {
			// 上下纹理需要旋转调整进行拼接
			texture.rotation = Math.PI; // 旋转180度
			texture.center = new THREE.Vector2(0.5, 0.5); // 以创建的向量作为旋转中心轴，进行旋转
			boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
		} else {
			boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
		}
	});
	const cube = new THREE.Mesh(geometry, boxMaterials);
	// z轴设置-1，将视觉拉入空间内部
	cube.geometry.scale(1, 1, -1);
	scene.add(cube);
}
// 创建空间面
function createPlane(num: number) {
	const boxGeometry: THREE.Mesh[] = [];
	// 前面
	const geometryF = new THREE.PlaneGeometry(4, 4);
	const materialF = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getStaticFile(`./img/${num}_f.jpg`)),
		side: THREE.DoubleSide
	});
	const meshF = new THREE.Mesh(geometryF, materialF);
	meshF.rotation.y = Math.PI;
	meshF.position.z = 2;
	boxGeometry.push(meshF);
	// 后面
	const geometryB = new THREE.PlaneGeometry(4, 4);
	const materialB = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getStaticFile(`./img/${num}_b.jpg`)),
		side: THREE.DoubleSide
	});
	const meshB = new THREE.Mesh(geometryB, materialB);
	meshB.position.z = -2;
	boxGeometry.push(meshB);
	// 左侧
	const geometryL = new THREE.PlaneGeometry(4, 4);
	const materialL = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getStaticFile(`./img/${num}_l.jpg`)),
		side: THREE.DoubleSide
	});
	const meshL = new THREE.Mesh(geometryL, materialL);
	meshL.rotation.y = Math.PI / 2;
	meshL.position.x = -2;
	boxGeometry.push(meshL);
	// 右侧
	const geometryR = new THREE.PlaneGeometry(4, 4);
	const materialR = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getStaticFile(`./img/${num}_r.jpg`)),
		side: THREE.DoubleSide
	});
	const meshR = new THREE.Mesh(geometryR, materialR);
	meshR.rotation.y = Math.PI / -2;
	meshR.position.x = 2;
	boxGeometry.push(meshR);
	// 上面
	const geometryT = new THREE.PlaneGeometry(4, 4);
	const materialT = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getStaticFile(`./img/${num}_u.jpg`)),
		side: THREE.DoubleSide
	});
	const meshT = new THREE.Mesh(geometryT, materialT);
	meshT.rotation.x = Math.PI / 2;
	meshT.rotation.z = Math.PI;
	meshT.position.y = 2;
	boxGeometry.push(meshT);
	// 下面
	const geometryD = new THREE.PlaneGeometry(4, 4);
	const materialD = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(getStaticFile(`./img/${num}_d.jpg`)),
		side: THREE.DoubleSide
	});
	const meshD = new THREE.Mesh(geometryD, materialD);
	meshD.rotation.x = Math.PI / -2;
	meshD.rotation.z = Math.PI;
	meshD.position.y = -2;
	boxGeometry.push(meshD);
	return boxGeometry;
}
// 初始化动画
function animate() {
	requestAnimationFrame(animate);
	//更新控制器，常被用在动画循环中。
	controls.update();
	// 重新渲染
	renderer.render(scene, camera);
}
// 定义初始化方法
function init() {
	initRenderer();
	initScene();
	initCamera();
	initMesh();
	animate();
}
onMounted(() => {
	vrContainer.value!.addEventListener("mousemove", onMouseMove, false);
	//window.addEventListener("mousemove", onMouseMove, false);
	vrContainer.value!.addEventListener("click", onMouseClick, false);
	init();
});
onBeforeUnmount(() => {
	vrContainer.value!.removeEventListener("mousemove", onMouseMove);
	//window.removeEventListener("mousemove", onMouseMove);
	vrContainer.value!.removeEventListener("click", onMouseClick);
});
</script>

<style scoped>
.vr-container {
	width: 100%;
	height: 100%;
}
</style>
