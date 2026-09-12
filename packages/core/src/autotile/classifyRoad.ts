import { popCount } from "../common";
import { TileSide } from "../grid";
import { SIDE_BITMASKS } from "./bitmask";

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
		const index = popCount(mask - 1);
		return [RoadType.DeadEnd, 90 * index];
	} else if (count === 2) {
		if (mask === (SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.South])) {
			return [RoadType.Straight, 0];
		} else if (mask === (SIDE_BITMASKS[TileSide.East] | SIDE_BITMASKS[TileSide.West])) {
			return [RoadType.Straight, 90];
		} else {
			return [
				RoadType.Curve,
				rotationToMatch(mask, SIDE_BITMASKS[TileSide.North] | SIDE_BITMASKS[TileSide.East]),
			];
		}
	} else if (count === 3) {
		return [RoadType.TJunction, rotationToMatchMissing(mask, SIDE_BITMASKS[TileSide.South])];
	} else if (count === 4) {
		return [RoadType.Cross, 0];
	}

	return undefined;
}

function rotationToMatch(mask: number, base: number): number {
	for (let i = 0; i < 4; i++) {
		if (mask === base) {
			return (360 - i * 90) % 360;
		}

		mask = rotateMaskClockwise(mask);
	}

	throw new Error();
}
function rotationToMatchMissing(mask: number, base: number): number {
	return rotationToMatch(mask, ~base & 0b1111);
}

function rotateMaskClockwise(mask: number): number {
	return ((mask << 1) & 0b1111) | (mask >>> 3);
}
