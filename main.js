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
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

camera.position.set(-90, 140, 140);
controls.update();

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

function createPlanet(size, texture, position, ring) {
	const geo = new THREE.SphereGeometry(size, 30, 30);
	const mat = new THREE.MeshStandardMaterial({
		map: textureLoader.load(texture)
	});
	const mesh = new THREE.Mesh(geo, mat);
	const obj = new THREE.Object3D();
	obj.add(mesh);

	if (ring) {
		const ringGeo = new THREE.RingGeometry(
			ring.innerRadius,
			ring.outerRadius,
			32
		);
		const ringMat = new THREE.MeshBasicMaterial({
			map: textureLoader.load(ring.texture),
			side: THREE.DoubleSide
		});
		const ringMesh = new THREE.Mesh(ringGeo, ringMat);
		obj.add(ringMesh);
		ringMesh.position.x = position;
		ringMesh.rotation.x = -0.5 * Math.PI;
	}

	scene.add(obj);
	mesh.position.x = position;

	const curve = new THREE.EllipseCurve(
		0,
		0,
		position,
		position,
		0,
		2 * Math.PI
	);
	const point = curve.getSpacedPoints(200);

	const lineGeo = new THREE.BufferGeometry().setFromPoints(point);
	const lineMat = new THREE.LineBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.2
	});

	const orbit = new THREE.Line(lineGeo, lineMat);
	orbit.rotateX(-Math.PI / 2);
	scene.add(orbit);

	return { mesh, obj };
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
	innerRadius: 10,
	outerRadius: 20,
	texture: saturnRingTexture
});
const uranus = createPlanet(7, uranusTexture, 176, {
	innerRadius: 7,
	outerRadius: 12,
	texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
	//Self-rotation
	sun.rotateY(0.004);
	mercury.mesh.rotateY(0.004);
	venus.mesh.rotateY(0.002);
	earth.mesh.rotateY(0.02);
	mars.mesh.rotateY(0.018);
	jupiter.mesh.rotateY(0.04);
	saturn.mesh.rotateY(0.038);
	uranus.mesh.rotateY(0.03);
	neptune.mesh.rotateY(0.032);
	pluto.mesh.rotateY(0.008);

	//Around-sun-rotation
	mercury.obj.rotateY(0.04);
	venus.obj.rotateY(0.015);
	earth.obj.rotateY(0.01);
	mars.obj.rotateY(0.008);
	jupiter.obj.rotateY(0.002);
	saturn.obj.rotateY(0.0009);
	uranus.obj.rotateY(0.0004);
	neptune.obj.rotateY(0.0001);
	pluto.obj.rotateY(0.00007);
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
});
