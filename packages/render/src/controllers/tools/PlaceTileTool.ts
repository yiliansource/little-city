import { type TileCoord, TileType, type World } from "@little-city/core";

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
			const valid = this.tileType !== null && this.world.grid.getType(coord) !== this.tileType;
			this.indicator.showAt(coord, valid);
		}
	}

	onClick(coord: TileCoord): void {
		if (this.tileType !== null) {
			if (this.tileType === TileType.Road) {
				this.world.grid.set(coord, { type: TileType.Road });
			} else if (this.tileType === TileType.House) {
				this.world.grid.set(coord, { type: TileType.House, variant: 0 });
			} else if (this.tileType === TileType.Park) {
				this.world.grid.set(coord, { type: TileType.Park, variant: 0, hasPath: false });
			}
		}
	}

	onDeactivate(): void {
		this.indicator.hide();
	}
}
