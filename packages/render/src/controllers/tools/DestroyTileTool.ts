import type { TileCoord, World } from "@little-city/core";

import type { TileIndicatorSystem } from "../../systems/TileIndicatorSystem";
import type { Tool } from "./tool";

export class DestroyTileTool implements Tool {
	constructor(
		private readonly world: World,
		private readonly indicator: TileIndicatorSystem
	) {}

	onHover(coord: TileCoord | null): void {
		if (coord === null) {
			this.indicator.hide();
		} else {
			const valid = this.world.grid.get(coord) !== undefined;
			this.indicator.showAt(coord, valid);
		}
	}

	onClick(coord: TileCoord): void {
		this.world.grid.delete(coord);
	}

	onDeactivate(): void {
		this.indicator.hide();
	}
}
