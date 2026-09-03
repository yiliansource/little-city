export interface Point {
	x: number;
	z: number;
}

export function point(x: number, z: number): Point {
	return { x, z };
}

export function pointScale(p: Point, s: number): Point {
	return point(p.x * s, p.z * s);
}
export function pointsAdd(a: Point, b: Point): Point {
	return point(a.x + b.x, a.z + b.z);
}
export function pointsSub(a: Point, b: Point): Point {
	return point(a.x - b.x, a.z - b.z);
}

export function pointsDistance(a: Point, b: Point): number {
	const delta = pointsSub(b, a);
	return Math.sqrt(delta.x ** 2 + delta.z ** 2);
}
