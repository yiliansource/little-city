import { assertDefined, PriorityQueue } from "../common";
import type { Point } from "../geometry";
import { type EdgeDirection, Graph, type GraphEdge, type GraphNode } from "./Graph";

export interface NavGraphNode extends GraphNode {
	position: Point;
}
export interface NavGraphEdge extends GraphEdge {
	length: number;
}

export interface AStarResult {
	nodes: string[];
	edges: string[];
	cost: number;
}

export class NavGraph extends Graph<NavGraphNode, NavGraphEdge> {
	astar(startId: string, goalId: string, direction: EdgeDirection = "out"): AStarResult | null {
		const goalNode = this.nodes.get(goalId);
		assertDefined(goalNode, `goal node is not in the graph`);

		const heuristic = (nodeId: string): number => {
			const node = this.nodes.get(nodeId);
			assertDefined(node, `node '${nodeId}' not in graph`);

			return Math.hypot(node.position.x - goalNode.position.x, node.position.z - goalNode.position.z);
		};

		const dist = new Map<string, number>([[startId, 0]]);
		const prevNode = new Map<string, string>();
		const prevEdge = new Map<string, string>();
		const visited = new Set<string>();

		const queue = PriorityQueue.min<string>();
		queue.push(startId, heuristic(startId));

		while (!queue.isEmpty()) {
			const current = queue.pop();
			assertDefined(current);

			if (current === goalId) break;
			if (visited.has(current)) continue;
			visited.add(current);

			const currentDist = dist.get(current);
			assertDefined(currentDist);

			for (const edgeId of this.incidentEdges(current, direction)) {
				const edge = this.edges.get(edgeId);
				assertDefined(edge, `edge '${edgeId}' not in graph`);

				const neighbour = edge.from === current ? edge.to : edge.from;
				if (visited.has(neighbour)) continue;

				const tentativeDist = currentDist + edge.length;
				const neighbourDist = dist.get(neighbour) ?? Number.POSITIVE_INFINITY;
				if (tentativeDist < neighbourDist) {
					dist.set(neighbour, tentativeDist);
					prevNode.set(neighbour, current);
					prevEdge.set(neighbour, edgeId);
					queue.push(neighbour, tentativeDist + heuristic(neighbour));
				}
			}
		}

		const goalDist = dist.get(goalId);
		if (goalDist === undefined) return null;

		const nodes: string[] = [goalId];
		const edges: string[] = [];
		let cur = goalId;
		while (cur !== startId) {
			const edge = prevEdge.get(cur);
			assertDefined(edge, `path reconstruction failed`);

			const newCur = prevNode.get(cur);
			assertDefined(newCur, `path reconstruction failed`);
			cur = newCur;

			edges.unshift(edge);
			nodes.unshift(cur);
		}

		return { nodes, edges, cost: goalDist };
	}
}
