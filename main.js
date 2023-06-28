import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import starsTexture from "/src/stars.jpg";
import sunTexture from "/src/sun.jpg";
import mercuryTexture from "/src/mercury.jpg";
import venusTexture from "/src/venus.jpg";
import earthTexture from "/src/earth.jpg";
import marsTexture from "/src/mars.jpg";
import jupiterTexture from "/src/jupiter.jpg";
import saturnTexture from "/src/saturn.jpg";
import saturnRingTexture from "/src/saturn ring.png";
import uranusTexture from "/src/uranus.jpg";
import uranusRingTexture from "/src/uranus ring.png";
import neptuneTexture from "/src/neptune.jpg";
import plutoTexture from "/src/pluto.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
	starsTexture,
	starsTexture,
	starsTexture,
	starsTexture,
	starsTexture,
	starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
	map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position) {
	const geo = new THREE.SphereGeometry(size, 30, 30);
	const mat = new THREE.MeshStandardMaterial({
		map: textureLoader.load(texture)
	});
	const mesh = new THREE.Mesh(geo, mat);
	const obj = new THREE.Object3D();
	obj.add(mesh);
	scene.add(obj);
	mesh.position.x = position;

	return { mesh, obj };
}

const mercury = createPlanet(3.2, mercuryTexture, 28);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
	sun.rotateY(0.004);
	mercury.mesh.rotateY(0.004);
	mercury.obj.rotateY(0.04);

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
