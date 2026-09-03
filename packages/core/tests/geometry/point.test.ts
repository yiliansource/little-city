import { describe, expect, test } from "bun:test";

import { point, pointScale, pointsAdd, pointsSub } from "@little-city/core";

describe("point", () => {
	test("scale", () => {
		const p = pointScale(point(2, 3), 0.5);

		expect(p.x).toBe(1);
		expect(p.z).toBe(1.5);
	});
	test("add", () => {
		const p = pointsAdd(point(2, 3), point(4, 5));

		expect(p.x).toBe(6);
		expect(p.z).toBe(8);
	});
	test("sub", () => {
		const p = pointsSub(point(2, 1), point(4, 6));

		expect(p.x).toBe(-2);
		expect(p.z).toBe(-5);
	});
});
