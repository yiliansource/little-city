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

export enum TileCorner {
	NorthEast = "northeast",
	SouthEast = "southeast",
	SouthWest = "southwest",
	NorthWest = "northwest",
}

const SIDE_OFFSETS: Record<TileSide, TileCoord> = {
	[TileSide.North]: tileCoord(0, -1),
	[TileSide.East]: tileCoord(1, 0),
	[TileSide.South]: tileCoord(0, 1),
	[TileSide.West]: tileCoord(-1, 0),
};

const CORNER_OFFSETS: Record<TileCorner, TileCoord> = {
	[TileCorner.NorthEast]: tileCoord(1, -1),
	[TileCorner.SouthEast]: tileCoord(1, 1),
	[TileCorner.SouthWest]: tileCoord(-1, 1),
	[TileCorner.NorthWest]: tileCoord(-1, -1),
};

const QUAD_OFFSETS: Record<TileCorner, TileCoord[]> = {
	[TileCorner.NorthEast]: [
		tileCoord(0, 0),
		SIDE_OFFSETS[TileSide.North],
		CORNER_OFFSETS[TileCorner.NorthEast],
		SIDE_OFFSETS[TileSide.East],
	],
	[TileCorner.SouthEast]: [
		tileCoord(0, 0),
		SIDE_OFFSETS[TileSide.East],
		CORNER_OFFSETS[TileCorner.SouthEast],
		SIDE_OFFSETS[TileSide.South],
	],
	[TileCorner.SouthWest]: [
		tileCoord(0, 0),
		SIDE_OFFSETS[TileSide.South],
		CORNER_OFFSETS[TileCorner.SouthWest],
		SIDE_OFFSETS[TileSide.West],
	],
	[TileCorner.NorthWest]: [
		tileCoord(0, 0),
		SIDE_OFFSETS[TileSide.West],
		CORNER_OFFSETS[TileCorner.NorthWest],
		SIDE_OFFSETS[TileSide.North],
	],
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

export function tileCoordSideNeighbour(coord: TileCoord, side: TileSide): TileCoord {
	return tileCoordAdd(coord, SIDE_OFFSETS[side]);
}
export function tileCoordSideNeighbours(coord: TileCoord): TileCoord[] {
	return Object.values(TileSide).map((s) => tileCoordSideNeighbour(coord, s));
}

export function tileCoordCornerNeighbour(coord: TileCoord, corner: TileCorner): TileCoord {
	return tileCoordAdd(coord, CORNER_OFFSETS[corner]);
}
export function tileCoordCornerNeighbours(coord: TileCoord): TileCoord[] {
	return Object.values(TileCorner).map((c) => tileCoordCornerNeighbour(coord, c));
}

export function tileCoordNeighbours(coord: TileCoord): TileCoord[] {
	return [...tileCoordSideNeighbours(coord), ...tileCoordCornerNeighbours(coord)];
}

export function tileCoordQuadNeighbours(coord: TileCoord, corner: TileCorner): TileCoord[] {
	return QUAD_OFFSETS[corner].map((o) => tileCoordAdd(coord, o));
}
