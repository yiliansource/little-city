export interface TileCoord {
	x: number;
	z: number;
}

export enum TileSide {
	North = "north",
	East = "east",
	South = "south",
	West = "west",
}

const SIDE_OFFSETS: Record<TileSide, TileCoord> = {
	[TileSide.North]: { x: 0, z: -1 },
	[TileSide.East]: { x: 1, z: 0 },
	[TileSide.South]: { x: 0, z: 1 },
	[TileSide.West]: { x: -1, z: 0 },
};

export function tileCoord(x: number, z: number): TileCoord {
	return { x, z };
}

export function tileCoordEquals(a: TileCoord | null, b: TileCoord | null): boolean {
	if (a === null || b === null) {
		return a === b;
	}
	return a.x === b.x && a.z === b.z;
}

export function tileCoordKey(coord: TileCoord): string {
	return `${coord.x},${coord.z}`;
}

export function parseTileCoordKey(s: string): TileCoord | undefined {
	const match = s.match(/^(-?\d+),(-?\d+)$/);
	if (match === null) return undefined;

	const [, x, z] = match;
	return tileCoord(Number(x), Number(z));
}

export function tileCoordAdd(a: TileCoord, b: TileCoord): TileCoord {
	return tileCoord(a.x + b.x, a.z + b.z);
}

export function tileCoordNeighbour(coord: TileCoord, side: TileSide): TileCoord {
	const o = SIDE_OFFSETS[side];
	return tileCoord(coord.x + o.x, coord.z + o.z);
}
export function tileCoordNeighbours(coord: TileCoord): TileCoord[] {
	return Object.values(TileSide).map((s) => tileCoordNeighbour(coord, s));
}
