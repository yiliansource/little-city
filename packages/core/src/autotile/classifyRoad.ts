import { popCount } from "../common";
import { TileSide } from "../grid";
import { getMaskRotationToMatch, getMaskRotationToMatchComplement, SIDE_BITMASKS } from "./bitmask";

export enum RoadType {
	Isolated = "isolated",
	DeadEnd = "deadEnd",
	Straight = "straight",
	Curve = "curve",
	TJunction = "tJunction",
	Cross = "cross",
}

export function classifyRoad(mask: number): [RoadType, number] | undefined {
	const count = popCount(mask);

	if (count === 0) {
		return [RoadType.Isolated, 0];
	} else if (count === 1) {
		const index = (4 - popCount(mask - 1)) % 4;
		return [RoadType.DeadEnd, 90 * index];
	} else if (count === 2) {
		if (mask === (SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.South])) {
			return [RoadType.Straight, 0];
		} else if (mask === (SIDE_BITMASKS[TileSide.East] | SIDE_BITMASKS[TileSide.West])) {
			return [RoadType.Straight, 90];
		} else {
			return [
				RoadType.Curve,
				getMaskRotationToMatch(SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.East], mask) * 90,
			];
		}
	} else if (count === 3) {
		return [RoadType.TJunction, getMaskRotationToMatchComplement(SIDE_BITMASKS[TileSide.South], mask) * 90];
	} else if (count === 4) {
		return [RoadType.Cross, 0];
	}

	return undefined;
}
