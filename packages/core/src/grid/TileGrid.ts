import { EventBus } from "../events/EventBus";
import { type TileCoord, tileCoordKey } from "./tileCoord";
import type { TileType } from "./tileTypes";

export interface TileGridEvents {
	tilePlaced: {
		coord: TileCoord;
		type: TileType;
	};
	tileDeleted: {
		coord: TileCoord;
	};
}

export class TileGrid {
	private readonly tiles = new Map<string, TileType>();

	readonly events = new EventBus<TileGridEvents>();

	get(coord: TileCoord): TileType | undefined {
		return this.tiles.get(tileCoordKey(coord));
	}
	set(coord: TileCoord, type: TileType): void {
		const key = tileCoordKey(coord);
		const previous = this.get(coord);
		if (previous === type) return;

		this.tiles.set(key, type);
		this.events.emit("tilePlaced", { coord, type });
	}
	delete(coord: TileCoord): boolean {
		const key = tileCoordKey(coord);
		const existing = this.tiles.get(key);
		if (existing === undefined) {
			return false;
		}

		this.tiles.delete(key);
		this.events.emit("tileDeleted", { coord });

		return true;
	}
}
