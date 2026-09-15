import * as THREE from "three";

import type { TileCoord } from "@little-city/core";

import { tileCoordToWorld } from "../common/coords";
import { BaseSceneSystem } from "./BaseSceneSystem";

export class TileIndicatorSystem extends BaseSceneSystem {
	private readonly outline: THREE.LineSegments;
	private readonly outlineMaterial: THREE.LineBasicMaterial;

	constructor() {
		super();

		const boxGeometry = new THREE.BoxGeometry(1, 0.05, 1);
		const edgeGeometry = new THREE.EdgesGeometry(boxGeometry);
		this.outlineMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff,
			linewidth: 2,
		});
		this.outline = new THREE.LineSegments(edgeGeometry, this.outlineMaterial);
		this.outline.position.set(0, 0.05 / 2, 0);

		this.group.add(this.outline);
		this.group.visible = false;
	}

	showAt(coord: TileCoord, valid: boolean): void {
		this.group.visible = true;
		this.group.position.copy(tileCoordToWorld(coord));
		this.outlineMaterial.color.set(valid ? 0x33cc33 : 0xcc3333);
	}

	hide(): void {
		this.group.visible = false;
	}

	override dispose(): void {
		this.outline.geometry.dispose();
		this.outlineMaterial.dispose();
	}
}
