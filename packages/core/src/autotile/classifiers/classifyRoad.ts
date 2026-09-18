import { popCount } from "../../common";
import { TileSide } from "../../grid";
import { getMaskRotationToMatch, getMaskRotationToMatchComplement, SIDE_BITMASKS } from "../bitmask";

export enum RoadType {
	Isolated = "isolated",
	DeadEnd = "deadEnd",
	Straight = "straight",
	Curve = "curve",
	TJunction = "tJunction",
	Cross = "cross",
}

export interface RoadClassification {
	type: RoadType;
	rotation: number;
}

export function classifyRoad(mask: number): RoadClassification | undefined {
	const roadConnections = popCount(mask);
	if (roadConnections === 0) {
		return {
			type: RoadType.Isolated,
			rotation: 0,
		};
	} else if (roadConnections === 1) {
		return {
			type: RoadType.DeadEnd,
			rotation: getMaskRotationToMatch(SIDE_BITMASKS[TileSide.North], mask) * 90,
		};
	} else if (roadConnections === 2) {
		if (mask === (SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.South])) {
			return {
				type: RoadType.Straight,
				rotation: 0,
			};
		} else if (mask === (SIDE_BITMASKS[TileSide.East] | SIDE_BITMASKS[TileSide.West])) {
			return {
				type: RoadType.Straight,
				rotation: 90,
			};
		} else {
			return {
				type: RoadType.Curve,
				rotation:
					getMaskRotationToMatch(SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.East], mask) * 90,
			};
		}
	} else if (roadConnections === 3) {
		return {
			type: RoadType.TJunction,
			rotation: getMaskRotationToMatchComplement(SIDE_BITMASKS[TileSide.South], mask) * 90,
		};
	} else if (roadConnections === 4) {
		return {
			type: RoadType.Cross,
			rotation: 0,
		};
	}

	return undefined;
}
