import type { TileCoord } from "@little-city/core";

export interface Tool {
	onHover(coord: TileCoord | null): void;
	onClick(coord: TileCoord): void;
	onDeactivate?(): void;
}
