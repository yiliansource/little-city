import type { TileCoord, World } from "@little-city/core";

import type { TileIndicatorSystem } from "../../systems/TileIndicatorSystem";
import type { Tool } from "./tool";

export class SelectTileTool implements Tool {
	constructor(
		_world: World,
		private readonly indicator: TileIndicatorSystem
	) {}

	onHover(_coord: TileCoord | null): void {
		this.indicator.hide();
	}

	onClick(_coord: TileCoord): void {
		// noop
	}
}
