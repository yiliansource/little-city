import { describe, expect, test } from "bun:test";

import {
	type TileCoord,
	TileSide,
	tileCoord,
	tileCoordAdd,
	tileCoordEquals,
	tileCoordNeighbour,
} from "@little-city/core";

describe("tile coordinates", () => {
	test("equals", () => {
		const a = tileCoord(1, 2);
		const b = tileCoord(1, 2);
		const c = tileCoord(2, 3);

		expect(tileCoordEquals(a, b)).toBe(true);
		expect(tileCoordEquals(b, c)).toBe(false);
		expect(tileCoordEquals(a, c)).toBe(false);
	});
	test("add", () => {
		const a = tileCoord(0, 1);
		const b = tileCoord(1, 2);

		const c = tileCoordAdd(a, b);
		expect(c.x).toBe(1);
		expect(c.z).toBe(3);
	});
	describe("neighbours", () => {
		const base = tileCoord(2, 3);
		const cases: [TileSide, TileCoord][] = [
			[TileSide.North, tileCoord(2, 2)],
			[TileSide.East, tileCoord(3, 3)],
			[TileSide.South, tileCoord(2, 4)],
			[TileSide.West, tileCoord(1, 3)],
		];

		test.each(cases)("%s", (side, expectedCoord) => {
			const neighbour = tileCoordNeighbour(base, side);
			expect(neighbour).toEqual(expectedCoord);
		});
	});
});
