import { describe, expect, test } from "bun:test";

import {
	type ConnectivityPredicate,
	computeSideConnectivityBitmask,
	TileGrid,
	TileType,
	tileCoord,
} from "@little-city/core";

describe("connectivity", () => {
	describe("compute bitmask", () => {
		test("maps each side to its own bit", () => {
			const grid = new TileGrid();
			grid.set(tileCoord(0, 0), { type: TileType.House, variant: 0 });
			grid.set(tileCoord(0, -1), { type: TileType.Road });
			grid.set(tileCoord(1, 0), { type: TileType.Park, hasPath: false, variant: 0 });
			grid.set(tileCoord(0, 1), { type: TileType.Road });
			grid.set(tileCoord(-1, 0), { type: TileType.Road });

			const onlyRoadConnects: ConnectivityPredicate = (_a, b) => b?.type === TileType.Road;

			expect(computeSideConnectivityBitmask(grid, tileCoord(0, 0), onlyRoadConnects)).toBe(0b1101);
		});
	});
});
