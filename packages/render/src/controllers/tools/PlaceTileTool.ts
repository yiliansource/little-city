import type { TileCoord, TileType, World } from "@little-city/core";

import type { TileIndicatorSystem } from "../../systems/TileIndicatorSystem";
import type { Tool } from "./tool";

export class PlaceTileTool implements Tool {
	private tileType: TileType | null = null;

	constructor(
		private readonly world: World,
		private readonly indicator: TileIndicatorSystem
	) {}

	setTileType(type: TileType | null): void {
		this.tileType = type;
	}

	onHover(coord: TileCoord | null): void {
		if (coord === null) {
			this.indicator.hide();
		} else {
			const valid = this.tileType !== null && this.world.grid.get(coord) !== this.tileType;
			this.indicator.showAt(coord, valid);
		}
	}

	onClick(coord: TileCoord): void {
		if (this.tileType !== null) {
			this.world.grid.set(coord, this.tileType);
		}
	}

	onDeactivate(): void {
		this.indicator.hide();
	}
}
