import { popCount } from "../../common";
import { type TileCoord, TileCorner, type TileGrid, TileSide, TileType, tileCoordQuadNeighbours } from "../../grid";
import { CORNER_BITMASKS, getMaskRotationToMatch, getMaskRotationToMatchComplement, SIDE_BITMASKS } from "../bitmask";
import {
	type ConnectivityPredicate,
	computeCornerConnectivityBitmask,
	computeSideConnectivityBitmask,
	parkPathConnectivity,
} from "../connectivity";

export enum ParkType {
	None = "none",
	Park = "park",
	WallEntry = "wallEntry",
	WallStraight = "wallStraight",
	WallInnerCorner = "wallInnerCorner",
	WallOuterCorner = "wallOuterCorner",
	PathStraight = "pathStraight",
	PathCurve = "pathCurve",
	PathTJunction = "pathTJunction",
	PathCross = "pathCross",
}

export interface ParkClassification {
	type: ParkType;
	rotation: number;
}

export interface ParkNeighbourhood {
	solid: boolean;
	sideMask: number;
	cornerMask: number;
	pathMask?: number;
}

function isSolidParkTile(grid: TileGrid, coord: TileCoord): boolean {
	return Object.values(TileCorner).some((corner) =>
		tileCoordQuadNeighbours(coord, corner).every((n) => grid.getType(n) === TileType.Park)
	);
}

export function computeParkNeighbourhood(grid: TileGrid, coord: TileCoord): ParkNeighbourhood {
	const parkData = grid.get(coord);
	if (parkData?.type !== TileType.Park) throw new Error("cannot compute park neighbourhood of non-park tile");

	const solidParkConnectivity: ConnectivityPredicate = (_from, to, _fromCoord, toCoord) =>
		to !== undefined && to.type === TileType.Park && isSolidParkTile(grid, toCoord);

	return {
		solid: isSolidParkTile(grid, coord),
		sideMask: computeSideConnectivityBitmask(grid, coord, solidParkConnectivity),
		cornerMask: computeCornerConnectivityBitmask(grid, coord, solidParkConnectivity),
		pathMask: parkData.hasPath ? computeSideConnectivityBitmask(grid, coord, parkPathConnectivity) : undefined,
	};
}

export function classifyPark(neighbourhood: ParkNeighbourhood): ParkClassification | undefined {
	if (!neighbourhood.solid) {
		return {
			type: ParkType.None,
			rotation: 0,
		};
	}

	const sideConnections = popCount(neighbourhood.sideMask);
	const cornerConnections = popCount(neighbourhood.cornerMask);

	if (sideConnections === 0 || sideConnections === 1) {
		return {
			type: ParkType.None,
			rotation: 0,
		};
	} else if (sideConnections === 2) {
		return {
			type: ParkType.WallOuterCorner,
			rotation:
				getMaskRotationToMatch(
					SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.East],
					neighbourhood.sideMask
				) * 90,
		};
	} else if (sideConnections === 3) {
		return {
			type: neighbourhood.pathMask === undefined ? ParkType.WallStraight : ParkType.WallEntry,
			rotation: getMaskRotationToMatchComplement(SIDE_BITMASKS[TileSide.South], neighbourhood.sideMask) * 90,
		};
	} else if (sideConnections === 4) {
		if (cornerConnections === 3) {
			return {
				type: ParkType.WallInnerCorner,
				rotation:
					getMaskRotationToMatchComplement(CORNER_BITMASKS[TileCorner.SouthWest], neighbourhood.cornerMask) *
					90,
			};
		} else {
			if (neighbourhood.pathMask === undefined) {
				return {
					type: ParkType.Park,
					rotation: 0,
				};
			}

			const pathConnections = popCount(neighbourhood.pathMask);
			if (pathConnections === 0 || pathConnections === 1) {
				// TODO: add a dead-end for the park paths
				return {
					type: ParkType.Park,
					rotation: 0,
				};
			} else if (pathConnections === 2) {
				if (neighbourhood.pathMask === (SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.South])) {
					return {
						type: ParkType.PathStraight,
						rotation: 0,
					};
				} else if (neighbourhood.pathMask === (SIDE_BITMASKS[TileSide.East] | SIDE_BITMASKS[TileSide.West])) {
					return {
						type: ParkType.PathStraight,
						rotation: 90,
					};
				} else {
					return {
						type: ParkType.PathCurve,
						rotation:
							getMaskRotationToMatch(
								SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.East],
								neighbourhood.pathMask
							) * 90,
					};
				}
			} else if (pathConnections === 3) {
				return {
					type: ParkType.PathTJunction,
					rotation:
						getMaskRotationToMatchComplement(SIDE_BITMASKS[TileSide.South], neighbourhood.pathMask) * 90,
				};
			} else if (pathConnections === 4) {
				return {
					type: ParkType.PathCross,
					rotation: 0,
				};
			}
		}
	}

	return undefined;
}
