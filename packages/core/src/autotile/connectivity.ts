import {
	type TileCoord,
	TileCorner,
	type TileData,
	type TileGrid,
	TileSide,
	TileType,
	tileCoordCornerNeighbour,
	tileCoordSideNeighbour,
} from "../grid";
import { CORNER_BITMASKS, SIDE_BITMASKS } from "./bitmask";

export type ConnectivityPredicate = (
	from: TileData | undefined,
	to: TileData | undefined,
	fromCoord: TileCoord,
	toCoord: TileCoord
) => boolean;

export const tileConnectivity: ConnectivityPredicate = (from, to) => from?.type === to?.type;

export const parkPathConnectivity: ConnectivityPredicate = (_, to) =>
	(to?.type === TileType.Park && to.hasPath) || to?.type !== TileType.Park;

export function computeSideConnectivityBitmask(
	grid: TileGrid,
	coord: TileCoord,
	doTilesConnect: ConnectivityPredicate
): number {
	const fromData = grid.get(coord);
	return Object.values(TileSide).reduce((mask, side) => {
		const neighbourCoord = tileCoordSideNeighbour(coord, side);
		const toData = grid.get(neighbourCoord);
		return mask | (doTilesConnect(fromData, toData, coord, neighbourCoord) ? SIDE_BITMASKS[side] : 0);
	}, 0);
}

export function computeCornerConnectivityBitmask(
	grid: TileGrid,
	coord: TileCoord,
	doTilesConnect: ConnectivityPredicate
) {
	const fromData = grid.get(coord);
	return Object.values(TileCorner).reduce((mask, corner) => {
		const neighbourCoord = tileCoordCornerNeighbour(coord, corner);
		const toData = grid.get(neighbourCoord);
		return mask | (doTilesConnect(fromData, toData, coord, neighbourCoord) ? CORNER_BITMASKS[corner] : 0);
	}, 0);
}
