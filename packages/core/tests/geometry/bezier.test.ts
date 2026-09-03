import { describe, expect, test } from "bun:test";

import { bezier, bezierLength, point } from "@little-city/core";

describe("bezier", () => {
	describe("length", () => {
		test("straight line, even spacing", () => {
			expect(
				bezierLength(
					bezier(point(0, 0), point(1, 0), point(2, 0), point(3, 0)),
				),
			).toBe(3);
		});
		test("straight line, uneven spacing", () => {
			expect(
				bezierLength(
					bezier(
						point(0, 0),
						point(0.2, 0),
						point(1.6, 0),
						point(2, 0),
					),
				),
			).toBe(2);
		});
		test("straight line, diagonal", () => {
			expect(
				bezierLength(
					bezier(point(1, 0), point(2, 1), point(3, 2), point(4, 3)),
				),
			).toBe(3 * Math.SQRT2);
		});
		test("degenerate", () => {
			expect(
				bezierLength(
					bezier(point(1, 2), point(1, 2), point(1, 2), point(1, 2)),
				),
			).toBe(0);
		});
		test("quadratic", () => {
			// B(t) = (t, t^2), 0 <= t <= 1
			// derivative: B'(t) = (1, 2t)
			// exact length: L = int_0^1 sqrt(1 + 4t^2) dt = sqrt(5) / 2 + asinh(2) / 4
			const exact = Math.sqrt(5) / 2 + Math.asinh(2) / 4;
			const curve = bezier(
				point(0, 0),
				point(1 / 3, 0),
				point(2 / 3, 1 / 3),
				point(1, 1),
			);

			const epsilon = 1e-8;
			expect(
				Math.abs(bezierLength(curve, epsilon) - exact),
			).toBeLessThanOrEqual(epsilon);
		});
	});
});
