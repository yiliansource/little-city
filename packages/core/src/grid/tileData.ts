import z from "zod";

export enum TileType {
	Road = "road",
	House = "house",
	Park = "park",
}

const baseTileSchema = z.object({ type: z.enum(TileType) });
export type BaseTileData = z.infer<typeof baseTileSchema>;

const roadTileSchema = baseTileSchema.extend({
	type: z.literal(TileType.Road),
});
export type RoadTileData = z.infer<typeof roadTileSchema>;

const houseTileSchema = baseTileSchema.extend({
	type: z.literal(TileType.House),
	variant: z.number().nonnegative(),
});
export type HouseTileData = z.infer<typeof houseTileSchema>;

const parkTileSchema = baseTileSchema.extend({
	type: z.literal(TileType.Park),
	variant: z.number().nonnegative(),
	hasPath: z.boolean(),
});
export type ParkTileData = z.infer<typeof parkTileSchema>;

export const tileSchema = z.discriminatedUnion("type", [roadTileSchema, houseTileSchema, parkTileSchema]);
export type TileData = z.infer<typeof tileSchema>;
