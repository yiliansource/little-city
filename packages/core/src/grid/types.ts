export type TileType = "empty" | "road" | "house" | "park";

export interface TileCoord {
	x: number;
	z: number;
}

export interface TileData {
	coord: TileCoord;
	type: TileType;
}
