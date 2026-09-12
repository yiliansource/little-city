import * as THREE from "three";

export abstract class BaseSceneSystem {
	readonly group: THREE.Group = new THREE.Group();

	abstract dispose(): void;
}
