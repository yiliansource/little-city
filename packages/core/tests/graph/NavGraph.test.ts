import { describe, expect, test } from "bun:test";

import { NavGraph, point } from "@little-city/core";

describe("nav graph", () => {
	describe("pathfinding", () => {
		function setup() {
			/**
			 * sets up the following graph:
			 *
			 *  /-->B---\
			 *  |   ^   v
			 *  A   C<--D
			 *  |       ^
			 *  \-------/
			 */
			const graph = new NavGraph();
			graph.upsertNode({ id: "a", position: point(0, 0) });
			graph.upsertNode({ id: "b", position: point(1, 1) });
			graph.upsertNode({ id: "c", position: point(1, 0) });
			graph.upsertNode({ id: "d", position: point(2, 0) });

			graph.insertEdge({
				id: "a-b",
				from: "a",
				to: "b",
				length: 2,
			});
			graph.insertEdge({
				id: "c-b",
				from: "c",
				to: "b",
				length: 20,
			});
			graph.insertEdge({
				id: "b-d",
				from: "b",
				to: "d",
				length: 2,
			});
			graph.insertEdge({
				id: "a-d",
				from: "a",
				to: "d",
				length: 999,
			});
			graph.insertEdge({
				id: "d-c",
				from: "d",
				to: "c",
				length: 2,
			});

			return graph;
		}

		test("finds the shortest path", () => {
			const graph = setup();

			expect(graph.astar("a", "d")).toEqual({
				nodes: ["a", "b", "d"],
				edges: ["a-b", "b-d"],
				cost: 4,
			});
			expect(graph.astar("d", "b")).toEqual({
				nodes: ["d", "c", "b"],
				edges: ["d-c", "c-b"],
				cost: 22,
			});
		});
		test("returns null when no path exists", () => {
			const graph = setup();
			graph.upsertNode({ id: "z", position: point(-100, -100) }); // isolated node

			expect(graph.astar("a", "z")).toBe(null);
		});
		test("respects edge orientation", () => {
			const graph = setup();

			expect(graph.astar("b", "a")).toBe(null);
			expect(graph.astar("d", "a")).toBe(null);
		});
		test("finds the trivial path", () => {
			const graph = setup();

			expect(graph.astar("a", "a")).toEqual({
				nodes: ["a"],
				edges: [],
				cost: 0,
			});
		});
	});
});
