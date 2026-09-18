import { TileCorner, TileSide } from "../grid";

export const SIDE_BITMASKS: Record<TileSide, number> = {
	[TileSide.North]: 1 << 0,
	[TileSide.East]: 1 << 1,
	[TileSide.South]: 1 << 2,
	[TileSide.West]: 1 << 3,
};

export const CORNER_BITMASKS: Record<TileCorner, number> = {
	[TileCorner.NorthEast]: 1 << 0,
	[TileCorner.SouthEast]: 1 << 1,
	[TileCorner.SouthWest]: 1 << 2,
	[TileCorner.NorthWest]: 1 << 3,
};

const BITMASK_FULL = 0b1111;

/**
 * Returns the number of rotations (counterclockwise) needed for the given mask to match the desired mask.
 *
 * Throws an error if matching is impossible.
 */
export function getMaskRotationToMatch(mask: number, match: number): number {
	for (let i = 0; i < 4; i++) {
		if (mask === match) {
			return i;
		}

		mask = rotateMaskCounterclockwise(mask);
	}

	throw new Error();
}

/**
 * Returns the number of rotations (counterclockwise) needed for the given mask to match the complement of the desired mask.
 *
 * Throws an error if matching is impossible.
 */
export function getMaskRotationToMatchComplement(mask: number, missing: number): number {
	return getMaskRotationToMatch(mask, ~missing & BITMASK_FULL);
}

/**
 * Rotates the given bitmask clockwise by one.
 */
export function rotateMaskClockwise(mask: number): number {
	return ((mask << 1) & BITMASK_FULL) | (mask >> 3);
}

/**
 * Rotates the given bitmask counterclockwise by one.
 */
export function rotateMaskCounterclockwise(mask: number): number {
	return ((mask << 3) & BITMASK_FULL) | (mask >> 1);
}
