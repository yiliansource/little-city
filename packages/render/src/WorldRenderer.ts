import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import type { World } from "@little-city/core";

import type { AssetCache, AssetKey } from "./assets";
import { ToolController } from "./controllers/ToolController";
import { NavGraphDebugSystem } from "./systems/debug";
import { DebugSystemCollection } from "./systems/debug/DebugSystemCollection";
import { TileIndicatorSystem } from "./systems/TileIndicatorSystem";
import { TileMeshSystem } from "./systems/TileMeshSystem";

function createScene(): THREE.Scene {
	return new THREE.Scene();
}
function createCamera(aspect: number): THREE.PerspectiveCamera {
	const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
	camera.position.set(6, 5, 8);

	return camera;
}
function createRenderer(container: HTMLElement): THREE.WebGLRenderer {
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);
	renderer.setSize(container.clientWidth, container.clientHeight);
	container.appendChild(renderer.domElement);

	return renderer;
}
function createControls(camera: THREE.Camera, container: HTMLElement): OrbitControls {
	const controls = new OrbitControls(camera, container);
	controls.enableDamping = true;
	controls.dampingFactor = 0.1;
	controls.minDistance = 1;
	controls.maxDistance = 20;
	controls.maxPolarAngle = Math.PI / 2;

	return controls;
}
function createGridHelper(): THREE.GridHelper {
	return new THREE.GridHelper(20, 20, 0x888888, 0x444444);
}
function createLighting(): THREE.Group {
	const lightingGroup = new THREE.Group();

	const hemiLight = new THREE.HemisphereLight(
		0x87ceeb, // sky color
		0x4a3c2a, // ground color
		0.6
	);
	lightingGroup.add(hemiLight);

	const sunLight = new THREE.DirectionalLight(0xfff4e6, 1.8);
	sunLight.position.set(30, 50, 20);
	sunLight.castShadow = true;

	sunLight.shadow.mapSize.width = 2048;
	sunLight.shadow.mapSize.height = 2048;
	sunLight.shadow.camera.near = 1;
	sunLight.shadow.camera.far = 200;

	const d = 50;
	sunLight.shadow.camera.left = -d;
	sunLight.shadow.camera.right = d;
	sunLight.shadow.camera.top = d;
	sunLight.shadow.camera.bottom = -d;

	sunLight.shadow.bias = -0.0005;
	sunLight.shadow.normalBias = 0.02;

	lightingGroup.add(sunLight);

	return lightingGroup;
}

export class WorldRenderer {
	readonly placementController: ToolController;

	private readonly scene: THREE.Scene;
	private readonly renderer: THREE.WebGLRenderer;
	private readonly resizeObserver: ResizeObserver;

	private readonly camera: THREE.PerspectiveCamera;
	private readonly controls: OrbitControls;

	private readonly tileMeshSystem: TileMeshSystem;
	private readonly placementIndicatorSystem: TileIndicatorSystem;
	private readonly debugSystems: DebugSystemCollection;

	private frameId: number | null = null;

	constructor(
		private container: HTMLElement,
		world: World,
		assetCache: AssetCache<AssetKey>
	) {
		this.scene = createScene();
		this.camera = createCamera(container.clientWidth / container.clientHeight);
		this.renderer = createRenderer(container);
		this.controls = createControls(this.camera, container);

		this.tileMeshSystem = new TileMeshSystem(world.grid, assetCache);
		this.scene.add(this.tileMeshSystem.group);

		this.placementIndicatorSystem = new TileIndicatorSystem();
		this.scene.add(this.placementIndicatorSystem.group);

		this.placementController = new ToolController(world, container, this.camera, this.placementIndicatorSystem);

		this.debugSystems = new DebugSystemCollection(this.scene);
		this.debugSystems.add(new NavGraphDebugSystem());

		this.scene.add(createGridHelper());
		this.scene.add(createLighting());

		this.resizeObserver = new ResizeObserver(() => this.onResize());
		this.resizeObserver.observe(container);
	}

	private onResize() {
		const { clientWidth: w, clientHeight: h } = this.container;
		this.camera.aspect = w / h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(w, h);
	}

	start() {
		this.animate();
	}

	private animate() {
		this.frameId = requestAnimationFrame(this.animate.bind(this));

		this.controls.update();

		this.renderer.render(this.scene, this.camera);
	}

	dispose() {
		if (this.frameId !== null) cancelAnimationFrame(this.frameId);

		this.resizeObserver.disconnect();

		this.tileMeshSystem.dispose();
		this.placementController.dispose();
		this.placementIndicatorSystem.dispose();
		this.debugSystems.dispose();

		this.controls.dispose();
		this.renderer.dispose();

		this.container.removeChild(this.renderer.domElement);
	}
}
