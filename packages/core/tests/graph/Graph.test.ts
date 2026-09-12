import { describe, expect, test } from "bun:test";

import { Graph, type GraphEdge, type GraphNode } from "@little-city/core";

describe("graph", () => {
	test("create empty graph", () => {
		const graph = new Graph();
		expect(graph.nodes.size).toBe(0);
		expect(graph.edges.size).toBe(0);
	});
	test("insert node", () => {
		const graph = new Graph();
		const node: GraphNode = { id: "a" };

		graph.upsertNode(node);

		expect(graph.nodes.size).toBe(1);
		expect(graph.nodes.get(node.id)).toBeTruthy();
	});
	test("insert edge", () => {
		const graph = new Graph();
		const edge: GraphEdge = {
			id: "a-b",
			from: "a",
			to: "b",
		};

		expect(() => graph.insertEdge(edge)).toThrow();

		graph.upsertNode({ id: "a" });
		graph.upsertNode({ id: "b" });
		graph.insertEdge(edge);

		expect(graph.edges.size).toBe(1);
		expect(graph.edges.get(edge.id)).toBeTruthy();
	});

	test("delete edge", () => {
		const graph = new Graph();
		graph.upsertNode({ id: "a" });
		graph.upsertNode({ id: "b" });
		graph.upsertNode({ id: "c" });
		graph.insertEdge({
			id: "a-b",
			from: "a",
			to: "b",
		});
		graph.insertEdge({
			id: "a-c",
			from: "a",
			to: "c",
		});
		graph.deleteEdge("a-b");

		expect(graph.nodes.size).toBe(3);
		expect(graph.edges.size).toBe(1);
	});
	test("delete node", () => {
		const graph = new Graph();
		graph.upsertNode({ id: "a" });
		graph.upsertNode({ id: "b" });
		graph.upsertNode({ id: "c" });
		graph.insertEdge({
			id: "a-b",
			from: "a",
			to: "b",
		});
		graph.insertEdge({
			id: "a-c",
			from: "a",
			to: "c",
		});
		graph.deleteNode("b");

		expect(graph.nodes.size).toBe(2);
		expect(graph.edges.size).toBe(1);

		graph.deleteNode("a");

		expect(graph.nodes.size).toBe(1);
		expect(graph.edges.size).toBe(0);
	});

	describe("neighbours", () => {
		const graph = new Graph();
		graph.upsertNode({ id: "a" });
		graph.upsertNode({ id: "b" });
		graph.upsertNode({ id: "c" });
		graph.insertEdge({
			id: "b-a",
			from: "b",
			to: "a",
		});
		graph.insertEdge({
			id: "a-c",
			from: "a",
			to: "c",
		});

		test("out", () => {
			expect(graph.neighbours("a", "out")).toEqual(["c"]);
			expect(graph.neighbours("b", "out")).toEqual(["a"]);
			expect(graph.neighbours("c", "out")).toEqual([]);
		});
		test("in", () => {
			expect(graph.neighbours("a", "in")).toEqual(["b"]);
			expect(graph.neighbours("b", "in")).toEqual([]);
			expect(graph.neighbours("c", "in")).toEqual(["a"]);
		});
		test("both", () => {
			expect(graph.neighbours("a", "both").toSorted()).toEqual(["b", "c"]);
			expect(graph.neighbours("b", "both")).toEqual(["a"]);
			expect(graph.neighbours("c", "both")).toEqual(["a"]);
		});
	});

	describe("incidentEdges", () => {
		const graph = new Graph();
		graph.upsertNode({ id: "a" });
		graph.upsertNode({ id: "b" });
		graph.upsertNode({ id: "c" });
		graph.insertEdge({
			id: "b-a",
			from: "b",
			to: "a",
		});
		graph.insertEdge({
			id: "a-c",
			from: "a",
			to: "c",
		});

		test("out", () => {
			expect(graph.incidentEdges("a", "out")).toEqual(["a-c"]);
			expect(graph.incidentEdges("b", "out")).toEqual(["b-a"]);
			expect(graph.incidentEdges("c", "out")).toEqual([]);
		});
		test("in", () => {
			expect(graph.incidentEdges("a", "in")).toEqual(["b-a"]);
			expect(graph.incidentEdges("b", "in")).toEqual([]);
			expect(graph.incidentEdges("c", "in")).toEqual(["a-c"]);
		});
		test("both", () => {
			expect(graph.incidentEdges("a", "both").toSorted()).toEqual(["a-c", "b-a"]);
			expect(graph.incidentEdges("b", "both")).toEqual(["b-a"]);
			expect(graph.incidentEdges("c", "both")).toEqual(["a-c"]);
		});
	});
});
