import { EventBus } from "../events/EventBus";
import { tileKey } from "./coords";
import type { TileCoord, TileData, TileType } from "./types";

export interface TileGridEvents {
	tilePlaced: {
		coord: TileCoord;
		type: TileType;
	};
	tileRemoved: {
		coord: TileCoord;
	};
}

export class TileGrid {
	private tiles = new Map<string, TileData>();

	readonly events = new EventBus<TileGridEvents>();

	getTile(coord: TileCoord): TileData | undefined {
		return this.tiles.get(tileKey(coord));
	}

	isRoad(coord: TileCoord): boolean {
		return this.getTile(coord)?.type === "road";
	}

	placeTile(coord: TileCoord, type: TileType): void {
		const key = tileKey(coord);
		const previous = this.tiles.get(key)?.type ?? null;
		if (previous === type) return;

		this.tiles.set(key, { coord, type });
		this.events.emit("tilePlaced", { coord, type });
	}

	removeTile(coord: TileCoord): void {
		const key = tileKey(coord);
		const existing = this.tiles.get(key);
		if (!existing) return;

		this.tiles.delete(key);
		this.events.emit("tileRemoved", { coord });
	}
}
