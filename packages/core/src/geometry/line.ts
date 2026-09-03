import { type Point, pointsDistance } from "./point";

export interface Line {
	a: Point;
	b: Point;
}

export function line(a: Point, b: Point): Line {
	return { a, b };
}

export function lineLength(l: Line): number {
	return pointsDistance(l.a, l.b);
}
