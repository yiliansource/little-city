import * as THREE from "three";

import type { BaseSceneSystem } from "../BaseSceneSystem";

export abstract class BaseDebugSystem implements BaseSceneSystem {
	readonly group = new THREE.Group();

	get isVisible(): boolean {
		return this.group.visible;
	}
	setVisible(visible: boolean): void {
		this.group.visible = visible;
	}

	abstract dispose(): void;
}
