import { describe, expect, test } from "bun:test";

import {
	type ConnectivityPredicate,
	computeConnectivityBitmask,
	getMaskRotationToMatch,
	getMaskRotationToMatchComplement,
	rotateMaskClockwise,
	rotateMaskCounterclockwise,
	TileGrid,
	TileType,
	tileCoord,
} from "@little-city/core";

describe("bitmask", () => {
	describe("compute connectivity bitmask", () => {
		test("maps each side to its own bit", () => {
			const grid = new TileGrid();
			grid.set(tileCoord(0, 0), { type: TileType.House, variant: 0 });
			grid.set(tileCoord(0, -1), { type: TileType.Road });
			grid.set(tileCoord(1, 0), { type: TileType.Park, hasPath: false, variant: 0 });
			grid.set(tileCoord(0, 1), { type: TileType.Road });
			grid.set(tileCoord(-1, 0), { type: TileType.Road });

			const onlyRoadConnects: ConnectivityPredicate = (_a, b) => b === TileType.Road;

			expect(computeConnectivityBitmask(grid, tileCoord(0, 0), onlyRoadConnects)).toBe(0b1101);
		});
	});

	describe("rotate mask", () => {
		test("clockwise", () => {
			expect(rotateMaskClockwise(0b0000)).toBe(0b0000);
			expect(rotateMaskClockwise(0b1111)).toBe(0b1111);

			expect(rotateMaskClockwise(0b0001)).toBe(0b0010);
			expect(rotateMaskClockwise(0b1000)).toBe(0b0001);
			expect(rotateMaskClockwise(0b0101)).toBe(0b1010);
		});
		test("counterclockwise", () => {
			expect(rotateMaskCounterclockwise(0b0000)).toBe(0b0000);
			expect(rotateMaskCounterclockwise(0b1111)).toBe(0b1111);

			expect(rotateMaskCounterclockwise(0b0001)).toBe(0b1000);
			expect(rotateMaskCounterclockwise(0b1000)).toBe(0b0100);
			expect(rotateMaskCounterclockwise(0b0101)).toBe(0b1010);
		});
	});

	describe("match mask rotation", () => {
		test("match", () => {
			expect(getMaskRotationToMatch(0b0000, 0b0000)).toBe(0);
			expect(getMaskRotationToMatch(0b0001, 0b1000)).toBe(1);
			expect(getMaskRotationToMatch(0b0101, 0b1010)).toBe(1);
			expect(getMaskRotationToMatch(0b1001, 0b0110)).toBe(2);
			expect(getMaskRotationToMatch(0b1000, 0b0001)).toBe(3);

			expect(() => getMaskRotationToMatch(0b0001, 0b0000)).toThrow();
		});
		test("match missing", () => {
			expect(getMaskRotationToMatchComplement(0b0000, 0b1111)).toBe(0);
			expect(getMaskRotationToMatchComplement(0b0110, 0b1001)).toBe(0);
			expect(getMaskRotationToMatchComplement(0b0101, 0b0101)).toBe(1);
			expect(getMaskRotationToMatchComplement(0b1110, 0b1000)).toBe(1);
			expect(getMaskRotationToMatchComplement(0b1101, 0b0100)).toBe(3);

			expect(() => getMaskRotationToMatchComplement(0b0001, 0b0000)).toThrow();
		});
	});
});
