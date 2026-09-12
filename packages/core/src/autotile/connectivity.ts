import type { TileType } from "../grid";

export function doTilesConnect(a: TileType | undefined, b: TileType | undefined) {
	// could do more complex connectivity in the future
	return a === b;
}
