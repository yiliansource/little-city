import { type TileCoord, type TileGrid, TileSide, tileCoordNeighbour } from "../grid";
import { doTilesConnect } from "./connectivity";

export const SIDE_BITMASKS: Record<TileSide, number> = {
	[TileSide.North]: 1 << 0,
	[TileSide.East]: 1 << 1,
	[TileSide.South]: 1 << 2,
	[TileSide.West]: 1 << 3,
};

export function computeConnectivityBitmask(grid: TileGrid, coord: TileCoord): number {
	const type = grid.get(coord);
	let mask = 0;

	for (const side of Object.values(TileSide)) {
		const neighbour = tileCoordNeighbour(coord, side);
		const neighbourType = grid.get(neighbour);

		if (doTilesConnect(type, neighbourType)) {
			mask |= SIDE_BITMASKS[side];
		}
	}

	return mask;
}
