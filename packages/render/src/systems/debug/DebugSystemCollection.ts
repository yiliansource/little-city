import type * as THREE from "three";

import type { BaseDebugSystem } from "./BaseDebugSystem";

export class DebugSystemCollection {
	private readonly systems: BaseDebugSystem[] = [];

	constructor(private parent: THREE.Scene | THREE.Group) {}

	add<T extends BaseDebugSystem>(system: T, visible = false): void {
		system.setVisible(visible);
		this.systems.push(system);
		this.parent.add(system.group);
	}

	setVisible(visible: boolean): void {
		for (const system of this.systems) {
			system.setVisible(visible);
		}
	}

	dispose(): void {
		for (const system of this.systems) {
			system.dispose();
		}
	}
}
