import { describe, expect, test } from "bun:test";

import {
	parseTileCoordKey,
	type TileCoord,
	TileSide,
	tileCoord,
	tileCoordAdd,
	tileCoordEquals,
	tileCoordKey,
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
	describe("key", () => {
		test("serialize", () => {
			expect(tileCoordKey(tileCoord(0, 0))).toBe("0,0");
			expect(tileCoordKey(tileCoord(2, 1))).toBe("2,1");
			expect(tileCoordKey(tileCoord(4, -2))).toBe("4,-2");
			expect(tileCoordKey(tileCoord(-1, -3))).toBe("-1,-3");
		});
		test("parse", () => {
			expect(parseTileCoordKey("0,0")).toEqual(tileCoord(0, 0));
			expect(parseTileCoordKey("3,4")).toEqual(tileCoord(3, 4));
			expect(parseTileCoordKey("-1,2")).toEqual(tileCoord(-1, 2));
			expect(parseTileCoordKey("-2,-5")).toEqual(tileCoord(-2, -5));
		});
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
