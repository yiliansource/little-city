import z from "zod";

import { tileSchema } from "../grid";

const tileSaveSchema = z.object({
	x: z.int(),
	z: z.int(),
	data: tileSchema,
});
export type TileSaveData = z.infer<typeof tileSaveSchema>;

export const worldSaveSchema = z.object({
	version: z.literal(1),
	tiles: z.array(tileSaveSchema),
});
export type WorldSaveData = z.infer<typeof worldSaveSchema>;
