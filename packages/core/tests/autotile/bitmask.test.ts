import { describe, expect, test } from "bun:test";

import { computeConnectivityBitmask, type TileCoord, TileGrid, TileType, tileCoord } from "@little-city/core";

describe("bitmask", () => {
	describe("compute tile bitmask", () => {
		/**
		 * sets up the following tilegrid (R = road, P = park, H = house, O = origin)
		 *
		 * OHHR
		 * HRRR
		 * PPRP
		 */
		const grid = new TileGrid();
		grid.set(tileCoord(1, 0), TileType.House);
		grid.set(tileCoord(2, 0), TileType.House);
		grid.set(tileCoord(3, 0), TileType.Road);
		grid.set(tileCoord(0, 1), TileType.House);
		grid.set(tileCoord(1, 1), TileType.Road);
		grid.set(tileCoord(2, 1), TileType.Road);
		grid.set(tileCoord(3, 1), TileType.Road);
		grid.set(tileCoord(0, 2), TileType.Park);
		grid.set(tileCoord(1, 2), TileType.Park);
		grid.set(tileCoord(2, 2), TileType.Road);
		grid.set(tileCoord(3, 2), TileType.Park);

		const cases: [TileCoord, number][] = [
			[tileCoord(3, 0), 0b0100],
			[tileCoord(1, 1), 0b0010],
			[tileCoord(2, 1), 0b1110],
			[tileCoord(3, 1), 0b1001],
			[tileCoord(0, 2), 0b0010],
			[tileCoord(1, 2), 0b1000],
			[tileCoord(2, 2), 0b0001],
			[tileCoord(3, 2), 0b0000],
		];

		const casesWithLabels: [string, string, TileCoord, number][] = cases.map(([coord, expected]) => [
			`(${coord.x},${coord.z})`,
			expected.toString(2).padStart(4, "0"),
			coord,
			expected,
		]);

		test.each(casesWithLabels)("at %p produces 0b%s", (_strCoord, _strExpected, coord, expected) => {
			expect(computeConnectivityBitmask(grid, coord)).toBe(expected);
		});
	});
});
