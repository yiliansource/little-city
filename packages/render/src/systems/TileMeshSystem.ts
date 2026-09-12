import * as THREE from "three";

import { type TileCoord, type TileGrid, TileType, tileCoordKey } from "@little-city/core";

import { tileCoordToWorld } from "../common";
import { BaseSceneSystem } from "./BaseSceneSystem";

const colorLookup: Record<TileType, number> = {
	[TileType.Road]: 0x666666,
	[TileType.Park]: 0x88cc88,
	[TileType.House]: 0xcccccc,
};

export class TileMeshSystem extends BaseSceneSystem {
	private readonly unsubscribes: (() => void)[] = [];

	private readonly coordObjectMap = new Map<string, THREE.Mesh>();

	constructor(grid: TileGrid) {
		super();

		this.onTilePlaced = this.onTilePlaced.bind(this);
		this.onTileDeleted = this.onTileDeleted.bind(this);

		this.unsubscribes.push(
			grid.events.on("tilePlaced", this.onTilePlaced),
			grid.events.on("tileDeleted", this.onTileDeleted)
		);
	}

	private onTilePlaced({ coord, type }: { coord: TileCoord; type: TileType }): void {
		this.removeTileMesh(coord);

		const geometry = new THREE.BoxGeometry(1, 0.2, 1);
		const material = new THREE.MeshStandardMaterial({
			color: colorLookup[type],
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(tileCoordToWorld(coord));

		this.group.add(mesh);
		this.coordObjectMap.set(tileCoordKey(coord), mesh);
	}
	private onTileDeleted({ coord }: { coord: TileCoord }): void {
		this.removeTileMesh(coord);
	}

	private removeTileMesh(coord: TileCoord): boolean {
		const key = tileCoordKey(coord);
		const mesh = this.coordObjectMap.get(key);
		if (mesh === undefined) return false;

		this.coordObjectMap.delete(key);
		this.group.remove(mesh);
		this.disposeMesh(mesh);

		return true;
	}

	private disposeMesh(mesh: THREE.Mesh): void {
		(mesh.material as THREE.Material).dispose();
		mesh.geometry.dispose();
	}

	override dispose(): void {
		while (this.unsubscribes.length > 0) {
			const unsubscribe = this.unsubscribes.pop();
			unsubscribe?.();
		}
	}
}
