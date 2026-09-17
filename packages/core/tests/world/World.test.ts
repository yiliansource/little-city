import { describe, expect, test } from "bun:test";

import { TileType, tileCoord, World } from "@little-city/core";

describe("World", () => {
	describe("serialization", () => {
		const saveData = {
			version: 1,
			tiles: [
				{
					x: 0,
					z: 0,
					data: {
						type: TileType.Road,
					},
				},
				{
					x: 1,
					z: 0,
					data: {
						type: TileType.House,
						variant: 1,
					},
				},
				{
					x: 2,
					z: 0,
					data: {
						type: TileType.Park,
						variant: 2,
						hasPath: false,
					},
				},
			],
		};
		const serializedSaveData = JSON.stringify(saveData);

		test("serialize", () => {
			const world = new World();
			world.grid.set(tileCoord(0, 0), { type: TileType.Road });
			world.grid.set(tileCoord(1, 0), { type: TileType.House, variant: 1 });
			world.grid.set(tileCoord(2, 0), { type: TileType.Park, variant: 2, hasPath: false });

			expect(world.serialize()).toBe(serializedSaveData);
		});
		test("deserialize", () => {
			const world = new World();
			world.grid.set(tileCoord(2, 2), { type: TileType.Road });
			world.deserialize(serializedSaveData);

			expect(world.grid.get(tileCoord(2, 2))).toBeUndefined();
			expect(world.grid.get(tileCoord(0, 0))).toEqual({ type: TileType.Road });
			expect(world.grid.get(tileCoord(1, 0))).toEqual({ type: TileType.House, variant: 1 });
			expect(world.grid.get(tileCoord(2, 0))).toEqual({ type: TileType.Park, variant: 2, hasPath: false });
		});
	});
});
