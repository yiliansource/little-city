import { describe, expect, test } from "bun:test";

import { PriorityQueue } from "@little-city/core";

describe("priority queue", () => {
	describe("min", () => {
		test("pops in ascending order", () => {
			const pq = PriorityQueue.min<string>();
			pq.push("c", 3);
			pq.push("a", 1);
			pq.push("b", 2);

			expect(pq.pop()).toBe("a");
			expect(pq.pop()).toBe("b");
			expect(pq.pop()).toBe("c");
		});
		test("isEmpty and size work", () => {
			const pq = PriorityQueue.min<string>();
			expect(pq.isEmpty()).toBe(true);

			pq.push("x", 5);
			expect(pq.isEmpty()).toBe(false);
			expect(pq.size).toBe(1);

			pq.pop();
			expect(pq.isEmpty()).toBe(true);
		});
		test("duplicate priorities", () => {
			const pq = PriorityQueue.min<string>();
			pq.push("a", 1);
			pq.push("b", 1);
			pq.push("c", 2);

			const first = pq.pop();
			const second = pq.pop();
			expect([first, second].sort()).toEqual(["a", "b"]);
			expect(pq.pop()).toBe("c");
		});
		test("pop when empty returns undefined", () => {
			const pq = PriorityQueue.min<string>();
			expect(pq.pop()).toBeUndefined();
		});
	});

	describe("max", () => {
		test("pops in descending order", () => {
			const pq = PriorityQueue.max<string>();
			pq.push("c", 3);
			pq.push("a", 1);
			pq.push("b", 2);

			expect(pq.pop()).toBe("c");
			expect(pq.pop()).toBe("b");
			expect(pq.pop()).toBe("a");
		});
	});
});
