import { describe, expect, test } from "bun:test";

import { classifyRoad, RoadType } from "@little-city/core";

describe("classify road", () => {
	const cases: [number, RoadType, number][] = [
		[0b0000, RoadType.Isolated, 0],

		[0b0001, RoadType.DeadEnd, 0],
		[0b1000, RoadType.DeadEnd, 90],
		[0b0100, RoadType.DeadEnd, 180],
		[0b0010, RoadType.DeadEnd, 270],

		[0b0101, RoadType.Straight, 0],
		[0b1010, RoadType.Straight, 90],

		[0b0011, RoadType.Curve, 0],
		[0b1001, RoadType.Curve, 90],
		[0b1100, RoadType.Curve, 180],
		[0b0110, RoadType.Curve, 270],

		[0b1011, RoadType.TJunction, 0],
		[0b1101, RoadType.TJunction, 90],
		[0b1110, RoadType.TJunction, 180],
		[0b0111, RoadType.TJunction, 270],

		[0b1111, RoadType.Cross, 0],
	];
	const casesWithLabels: [string, RoadType, number, number][] = cases.map(
		([mask, expectedType, expectedRotation]) => [
			mask.toString(2).padStart(4, "0"),
			expectedType,
			expectedRotation,
			mask,
		]
	);

	test.each(casesWithLabels)("0b%s -> %s, %d°", (_strMask, expectedType, expectedRotation, mask) => {
		expect(classifyRoad(mask)).toEqual([expectedType, expectedRotation]);
	});

	test("invalid mask", () => {
		expect(classifyRoad(0b11101101)).toBeUndefined();
	});
});
