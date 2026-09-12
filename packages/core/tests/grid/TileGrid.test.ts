import { describe, expect, test } from "bun:test";

import { type TileCoord, TileGrid, TileType, tileCoord } from "@little-city/core";

describe("tile grid", () => {
	test("get/set", () => {
		const grid = new TileGrid();
		grid.set(tileCoord(1, 1), TileType.Park);
		grid.set(tileCoord(1, 2), TileType.Road);

		expect(grid.get(tileCoord(1, 0))).toBe(undefined);
		expect(grid.get(tileCoord(1, 1))).toBe(TileType.Park);
		expect(grid.get(tileCoord(1, 2))).toBe(TileType.Road);
	});
	test("delete", () => {
		const grid = new TileGrid();
		const coord = tileCoord(1, 2);

		expect(grid.delete(coord)).toBe(false);

		grid.set(coord, TileType.Road);
		expect(grid.delete(coord)).toBe(true);
		expect(grid.get(coord)).toBe(undefined);
	});
	describe("events", () => {
		test("placed", () => {
			const logs: [TileCoord, TileType][] = [];
			const grid = new TileGrid();
			grid.events.on("tilePlaced", ({ coord, type }) => {
				logs.push([coord, type]);
			});

			grid.set(tileCoord(1, 2), TileType.Road);
			grid.set(tileCoord(3, 4), TileType.Park);
			grid.set(tileCoord(1, 2), TileType.Road); // nothing happens
			grid.set(tileCoord(1, 2), TileType.House);

			expect(logs).toEqual([
				[tileCoord(1, 2), TileType.Road],
				[tileCoord(3, 4), TileType.Park],
				[tileCoord(1, 2), TileType.House],
			]);
		});
		test("removed", () => {
			const logs: TileCoord[] = [];
			const grid = new TileGrid();
			grid.events.on("tileDeleted", ({ coord }) => {
				logs.push(coord);
			});

			grid.set(tileCoord(2, 2), TileType.Road);
			grid.set(tileCoord(2, 3), TileType.Road);

			grid.delete(tileCoord(1, 2)); // nothing happens
			grid.delete(tileCoord(2, 2));
			grid.delete(tileCoord(2, 3));
			grid.delete(tileCoord(2, 3)); // nothing happens

			expect(logs).toEqual([tileCoord(2, 2), tileCoord(2, 3)]);
		});
	});
});
