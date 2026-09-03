import type { TileCoord } from "./types";

export const SIDES = ["N", "E", "S", "W"] as const;
export type Side = (typeof SIDES)[number];

const SIDE_OFFSETS: Record<Side, TileCoord> = {
	N: { x: 0, z: -1 },
	E: { x: 1, z: 0 },
	S: { x: 0, z: 1 },
	W: { x: -1, z: 0 },
};

export function tileCoord(x: number, z: number): TileCoord {
	return { x, z };
}

export function tileKey(coord: TileCoord): string {
	return `${coord.x},${coord.z}`;
}

export function neighborCoord(coord: TileCoord, side: Side): TileCoord {
	const o = SIDE_OFFSETS[side];
	return tileCoord(coord.x + o.x, coord.z + o.z);
}
