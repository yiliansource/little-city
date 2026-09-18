import type * as THREE from "three";

import {
	type TileCoord,
	type TileData,
	type TileGrid,
	TileType,
	tileCoordKey,
	tileCoordNeighbours,
} from "@little-city/core";

import { type AssetCache, type AssetData, type AssetKey, getParkTileAsset, getRoadTileAsset } from "../assets";
import { DEG2RAD, tileCoordToWorld } from "../common";
import { BaseSceneSystem } from "./BaseSceneSystem";

export class TileMeshSystem extends BaseSceneSystem {
	private readonly coordObjectMap = new Map<string, THREE.Object3D>();
	private readonly unsubscribes: (() => void)[] = [];

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

		for (const [coord] of this.grid.entries()) {
			this.placeTileAsset(coord);
		}
	}

	private onTilePlaced({ coord }: { coord: TileCoord; data: TileData }): void {
		this.regenerateChunk(coord);
	}
	private onTileDeleted({ coord }: { coord: TileCoord }): void {
		this.regenerateChunk(coord);
	}

	private regenerateChunk(coord: TileCoord): void {
		for (const c of [coord, ...tileCoordNeighbours(coord)]) {
			this.removeAsset(c);
			this.placeTileAsset(c);
		}
	}
	private placeTileAsset(coord: TileCoord): void {
		const type = this.grid.getType(coord);
		if (type === undefined) return;

		if (type === TileType.Road) {
			this.placeAsset(coord, getRoadTileAsset(this.grid, coord));
		} else if (type === TileType.Park) {
			this.placeAsset(coord, getParkTileAsset(this.grid, coord));
		} else {
			throw new Error("not implemented");
		}
	}

	private placeAsset(coord: TileCoord, asset: AssetData): void {
		const instance = this.assetCache.get(asset.assetKey);
		instance.position.copy(tileCoordToWorld(coord));
		instance.rotation.y = asset.rotation * DEG2RAD;

		this.group.add(instance);
		this.coordObjectMap.set(tileCoordKey(coord), instance);
	}

	private removeAsset(coord: TileCoord): boolean {
		const key = tileCoordKey(coord);
		const mesh = this.coordObjectMap.get(key);
		if (mesh === undefined) return false;

		this.coordObjectMap.delete(key);
		this.group.remove(mesh);

		return true;
	}

	override dispose(): void {
		while (this.unsubscribes.length > 0) this.unsubscribes.pop()?.();
	}
}
