import * as THREE from "three";

import type { TileCoord } from "@little-city/core";

import { tileCoordToWorld } from "../common/coords";
import { BaseSceneSystem } from "./BaseSceneSystem";

export class TileIndicatorSystem extends BaseSceneSystem {
	private readonly box: THREE.Mesh;
	private readonly material: THREE.MeshBasicMaterial;

	constructor() {
		super();

		const boxGeometry = new THREE.BoxGeometry(1, 0.05, 1);
		this.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.4,
		});
		this.box = new THREE.Mesh(boxGeometry, this.material);
		this.box.position.set(0, 0.05 / 2, 0);
		this.box.scale.multiplyScalar(1.01);

		this.group.add(this.box);
		this.group.visible = false;
	}

	showAt(coord: TileCoord, valid: boolean): void {
		this.group.visible = true;
		this.group.position.copy(tileCoordToWorld(coord));
		this.material.color.set(valid ? 0x33cc33 : 0xcc3333);
	}

	hide(): void {
		this.group.visible = false;
	}

	override dispose(): void {
		this.box.geometry.dispose();
		this.material.dispose();
	}
}
