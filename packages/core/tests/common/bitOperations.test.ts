import { describe, expect, test } from "bun:test";

import { popCount } from "@little-city/core";

describe("bit operations", () => {
	describe("popcount", () => {
		const cases: [number, number][] = [
			[0, 0],
			[1, 1],
			[5, 2],
			[255, 8],
		];

		const casesWithBinary: [number, string, number][] = cases.map(([num, expected]) => [
			num,
			num.toString(2).padStart(8, "0"),
			expected,
		]);

		test.each(casesWithBinary)("%i (0b%s) -> %i", (num, _binary, expected) => {
			expect(popCount(num)).toBe(expected);
		});
	});
});
