import { EventBus } from "../events/EventBus";
import { parseTileCoordKey, type TileCoord, tileCoordKey } from "./tileCoord";
import type { TileData, TileType } from "./tileData";

export interface TileGridEvents {
	tilePlaced: {
		coord: TileCoord;
		data: TileData;
	};
	tileDeleted: {
		coord: TileCoord;
	};
}

export class TileGrid {
	private readonly tiles = new Map<string, TileData>();

	readonly events = new EventBus<TileGridEvents>();

	get(coord: TileCoord): TileData | undefined {
		return this.tiles.get(tileCoordKey(coord));
	}
	getType(coord: TileCoord): TileType | undefined {
		return this.get(coord)?.type;
	}

	set(coord: TileCoord, data: TileData): void {
		const key = tileCoordKey(coord);
		const previousType = this.getType(coord);
		if (previousType === data.type) return;

		this.tiles.set(key, data);
		this.events.emit("tilePlaced", { coord, data });
	}

	delete(coord: TileCoord): boolean {
		const key = tileCoordKey(coord);
		const existing = this.tiles.get(key);
		if (existing === undefined) return false;

		this.tiles.delete(key);
		this.events.emit("tileDeleted", { coord });

		return true;
	}

	clear(): void {
		for (const key of this.tiles.keys()) {
			const coord = parseTileCoordKey(key);
			if (coord === undefined) throw new Error("malformed coordinate key in tile grid");

			this.delete(coord);
		}
	}

	entries(): [TileCoord, TileData][] {
		return this.tiles
			.entries()
			.map(([key, data]) => {
				const coord = parseTileCoordKey(key);
				if (coord === undefined) throw new Error("malformed coordinate key in tile grid");

				return [coord, data] as [TileCoord, TileData];
			})
			.toArray();
	}
}
