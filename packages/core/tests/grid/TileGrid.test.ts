import { describe, expect, test } from "bun:test";

import { type ParkTileData, type RoadTileData, type TileCoord, TileGrid, TileType, tileCoord } from "@little-city/core";

describe("tile grid", () => {
	test("get/set", () => {
		const parkData: ParkTileData = { type: TileType.Park, hasPath: false, variant: 0 };
		const roadData: RoadTileData = { type: TileType.Road };

		const grid = new TileGrid();
		grid.set(tileCoord(1, 1), parkData);
		grid.set(tileCoord(1, 2), roadData);

		expect(grid.get(tileCoord(1, 0))).toBe(undefined);
		expect(grid.get(tileCoord(1, 1))).toBe(parkData);
		expect(grid.get(tileCoord(1, 2))).toBe(roadData);

		expect(grid.getType(tileCoord(1, 0))).toBe(undefined);
		expect(grid.getType(tileCoord(1, 1))).toBe(TileType.Park);
		expect(grid.getType(tileCoord(1, 2))).toBe(TileType.Road);
	});
	test("delete", () => {
		const grid = new TileGrid();
		const coord = tileCoord(1, 2);

		expect(grid.delete(coord)).toBe(false);

		grid.set(coord, { type: TileType.Road });
		expect(grid.delete(coord)).toBe(true);
		expect(grid.get(coord)).toBe(undefined);
	});
	test("clear", () => {
		const grid = new TileGrid();
		grid.set(tileCoord(-1, 0), { type: TileType.Road });
		grid.set(tileCoord(0, 1), { type: TileType.Road });
		grid.clear();

		expect(grid.entries().length).toBe(0);
	});
	test("entries", () => {
		const grid = new TileGrid();
		grid.set(tileCoord(-1, 0), { type: TileType.Road });
		grid.set(tileCoord(0, 1), { type: TileType.House, variant: 0 });
		grid.set(tileCoord(2, 2), { type: TileType.Park, hasPath: false, variant: 0 });

		expect(grid.entries()).toEqual([
			[tileCoord(-1, 0), { type: TileType.Road }],
			[tileCoord(0, 1), { type: TileType.House, variant: 0 }],
			[tileCoord(2, 2), { type: TileType.Park, hasPath: false, variant: 0 }],
		]);
	});
	describe("events", () => {
		test("placed", () => {
			const logs: [TileCoord, TileType][] = [];
			const grid = new TileGrid();
			grid.events.on("tilePlaced", ({ coord, data }) => {
				logs.push([coord, data.type]);
			});

			grid.set(tileCoord(1, 2), { type: TileType.Road });
			grid.set(tileCoord(3, 4), { type: TileType.Park, hasPath: false, variant: 0 });
			grid.set(tileCoord(1, 2), { type: TileType.House, variant: 0 });

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

			grid.set(tileCoord(2, 2), { type: TileType.Road });
			grid.set(tileCoord(2, 3), { type: TileType.Road });

			grid.delete(tileCoord(1, 2)); // nothing happens
			grid.delete(tileCoord(2, 2));
			grid.delete(tileCoord(2, 3));
			grid.delete(tileCoord(2, 3)); // nothing happens

			expect(logs).toEqual([tileCoord(2, 2), tileCoord(2, 3)]);
		});
	});
});
