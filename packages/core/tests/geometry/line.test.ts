import { describe, expect, test } from "bun:test";

import { line, lineLength, point } from "@little-city/core";

describe("line", () => {
	describe("length", () => {
		test("straight", () => {
			expect(lineLength(line(point(0, 0), point(2, 0)))).toBe(2);
		});
		test("diagonal", () => {
			expect(lineLength(line(point(1, 0), point(2, 1)))).toBe(Math.SQRT2);
		});
		test("degenerate", () => {
			expect(lineLength(line(point(1, 2), point(1, 2)))).toBe(0);
		});
	});
});
