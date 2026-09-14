import * as THREE from "three";

import {
	classifyRoad,
	computeConnectivityBitmask,
	RoadType,
	type TileCoord,
	type TileGrid,
	TileType,
	tileCoordKey,
	tileCoordNeighbours,
} from "@little-city/core";

import type { AssetCache, AssetKey, RoadAssetKey } from "../assets";
import { tileCoordToWorld } from "../common";
import { disposeObject3D } from "../common/dispose";
import { BaseSceneSystem } from "./BaseSceneSystem";

const colorLookup: Record<TileType, number> = {
	[TileType.Road]: 0x666666,
	[TileType.Park]: 0x88cc88,
	[TileType.House]: 0xcccccc,
};

const roadAssetLookup: Record<RoadType, RoadAssetKey> = {
	[RoadType.Isolated]: "road_isolated",
	[RoadType.DeadEnd]: "road_deadend",
	[RoadType.Curve]: "road_curve",
	[RoadType.Straight]: "road_straight",
	[RoadType.TJunction]: "road_tjunction",
	[RoadType.Cross]: "road_cross",
};

export class TileMeshSystem extends BaseSceneSystem {
	private readonly unsubscribes: (() => void)[] = [];
	private readonly coordObjectMap = new Map<string, THREE.Object3D>();
	private readonly ownedObjects = new Set<THREE.Object3D>(); // temporary while we still use placeholder meshes

	constructor(
		private readonly grid: TileGrid,
		private readonly assetCache: AssetCache<AssetKey>
	) {
		super();

		this.onTilePlaced = this.onTilePlaced.bind(this);
		this.onTileDeleted = this.onTileDeleted.bind(this);

		this.unsubscribes.push(
			grid.events.on("tilePlaced", this.onTilePlaced),
			grid.events.on("tileDeleted", this.onTileDeleted)
		);
	}

	private onTilePlaced({ coord }: { coord: TileCoord; type: TileType }): void {
		this.regenerateChunk(coord);
	}
	private onTileDeleted({ coord }: { coord: TileCoord }): void {
		this.regenerateChunk(coord);
	}

	private regenerateChunk(coord: TileCoord): void {
		for (const c of [coord, ...tileCoordNeighbours(coord)]) {
			this.removeTileMesh(c);
			const type = this.grid.get(c);
			if (type === undefined) continue;

			if (type === TileType.Road) {
				this.loadRoadMesh(c);
			} else {
				this.createBoxMesh(c, type);
			}
		}
	}

	private loadRoadMesh(coord: TileCoord): void {
		const mask = computeConnectivityBitmask(this.grid, coord);
		const classification = classifyRoad(mask);
		if (classification === undefined) throw new Error("invalid road classification");
		const [roadType, rotationY] = classification;

		const original = this.assetCache.get(roadAssetLookup[roadType]);

		const instance = original.clone();
		instance.position.copy(tileCoordToWorld(coord));
		instance.rotation.y = (rotationY * Math.PI) / 180;

		this.group.add(instance);
		this.coordObjectMap.set(tileCoordKey(coord), instance);
	}
	private createBoxMesh(coord: TileCoord, tileType: TileType): void {
		const geometry = new THREE.BoxGeometry(1, 0.2, 1);
		const material = new THREE.MeshStandardMaterial({
			color: colorLookup[tileType],
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(tileCoordToWorld(coord));

		this.group.add(mesh);
		this.coordObjectMap.set(tileCoordKey(coord), mesh);
		this.ownedObjects.add(mesh);
	}

	private removeTileMesh(coord: TileCoord): boolean {
		const key = tileCoordKey(coord);
		const mesh = this.coordObjectMap.get(key);
		if (mesh === undefined) return false;

		this.coordObjectMap.delete(key);
		this.group.remove(mesh);
		this.disposeIfOwned(mesh);

		return true;
	}

	private disposeIfOwned(obj: THREE.Object3D): void {
		if (!this.ownedObjects.has(obj)) return;
		this.ownedObjects.delete(obj);
		disposeObject3D(obj);
	}

	override dispose(): void {
		while (this.unsubscribes.length > 0) this.unsubscribes.pop()?.();
		for (const obj of this.coordObjectMap.values()) this.disposeIfOwned(obj);
	}
}
