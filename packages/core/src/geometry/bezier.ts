import { type Point, pointScale, pointsAdd, pointsDistance } from "./point";

export interface Bezier {
	p0: Point;
	p1: Point;
	p2: Point;
	p3: Point;
}

export function bezier(p0: Point, p1: Point, p2: Point, p3: Point): Bezier {
	return { p0, p1, p2, p3 };
}

export function bezierLength(b: Bezier, epsilon = 1e-4): number {
	const { p0, p1, p2, p3 } = b;
	const lower = pointsDistance(p0, p3);
	const upper =
		pointsDistance(p0, p1) +
		pointsDistance(p1, p2) +
		pointsDistance(p2, p3);

	if (upper - lower <= 2 * epsilon) {
		return (lower + upper) / 2;
	}

	const midpoint = (a: Point, b: Point) => pointScale(pointsAdd(a, b), 0.5);

	const p01 = midpoint(p0, p1);
	const p12 = midpoint(p1, p2);
	const p23 = midpoint(p2, p3);

	const p012 = midpoint(p01, p12);
	const p123 = midpoint(p12, p23);

	const p0123 = midpoint(p012, p123);

	const left = bezierLength(bezier(p0, p01, p012, p0123), epsilon / 2);
	const right = bezierLength(bezier(p0123, p123, p23, p3), epsilon / 2);

	return left + right;
}
