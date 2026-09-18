import { type TileCoord, TileType, type World } from "@little-city/core";

import type { TileIndicatorSystem } from "../../systems/TileIndicatorSystem";
import type { Tool } from "./tool";

export class ParkPathTool implements Tool {
	constructor(
		private readonly world: World,
		private readonly indicator: TileIndicatorSystem
	) {}

	onHover(coord: TileCoord | null): void {
		if (coord === null) {
			this.indicator.hide();
		} else {
			const data = this.world.grid.get(coord);
			const valid = data !== undefined && data.type === TileType.Park;
			this.indicator.showAt(coord, valid);
		}
	}

	onClick(coord: TileCoord): void {
		const data = this.world.grid.get(coord);
		if (data === undefined || data.type !== TileType.Park) return;

		this.world.grid.set(coord, {
			type: TileType.Park,
			variant: data.variant,
			hasPath: !data.hasPath,
		});
	}

	onDeactivate(): void {
		this.indicator.hide();
	}
}
