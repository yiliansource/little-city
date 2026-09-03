export interface GraphNode {
	id: string;
}
export interface GraphEdge {
	id: string;
	from: string;
	to: string;
}

export type EdgeDirection = "in" | "out" | "both";

export class Graph<
	N extends GraphNode = GraphNode,
	E extends GraphEdge = GraphEdge,
> {
	readonly nodes = new Map<string, N>();
	readonly edges = new Map<string, E>();

	private nodeOutgoingEdges = new Map<string, Set<string>>();
	private nodeIncomingEdges = new Map<string, Set<string>>();

	upsertNode(node: N): void {
		const exists = this.nodes.has(node.id);
		if (!exists) {
			this.nodeOutgoingEdges.set(node.id, new Set());
			this.nodeIncomingEdges.set(node.id, new Set());
		}

		this.nodes.set(node.id, node);
	}
	deleteNode(nodeId: string): boolean {
		const node = this.nodes.get(nodeId);
		if (node !== undefined) {
			for (const edgeId of [
				...(this.nodeOutgoingEdges.get(nodeId) ?? []),
				...(this.nodeIncomingEdges.get(nodeId) ?? []),
			]) {
				this.edges.delete(edgeId);
			}

			this.nodeOutgoingEdges.delete(nodeId);
			this.nodeIncomingEdges.delete(nodeId);
		}
		return this.nodes.delete(nodeId);
	}

	insertEdge(edge: E): void {
		if (!this.nodes.has(edge.from)) {
			throw new Error("graph does not contain start node");
		}
		if (!this.nodes.has(edge.to)) {
			throw new Error("graph does not contain end node");
		}

		this.edges.set(edge.id, edge);

		this.nodeOutgoingEdges.get(edge.from)?.add(edge.id);
		this.nodeIncomingEdges.get(edge.to)?.add(edge.id);
	}
	deleteEdge(edgeId: string): boolean {
		const edge = this.edges.get(edgeId);
		if (edge !== undefined) {
			this.nodeOutgoingEdges.get(edge.from)?.delete(edge.id);
			this.nodeIncomingEdges.get(edge.to)?.delete(edge.id);
		}
		return this.edges.delete(edgeId);
	}

	neighbours(nodeId: string, direction: EdgeDirection = "out"): string[] {
		const neighbourIds: string[] = [];
		if (direction === "in" || direction === "both") {
			const incomingEdges = this.nodeIncomingEdges.get(nodeId);
			if (incomingEdges !== undefined) {
				for (const edgeId of incomingEdges.values()) {
					const edge = this.edges.get(edgeId);
					if (edge !== undefined) {
						neighbourIds.push(edge.from);
					}
				}
			}
		}
		if (direction === "out" || direction === "both") {
			const outgoingEdges = this.nodeOutgoingEdges.get(nodeId);
			if (outgoingEdges !== undefined) {
				for (const edgeId of outgoingEdges.values()) {
					const edge = this.edges.get(edgeId);
					if (edge !== undefined) {
						neighbourIds.push(edge.to);
					}
				}
			}
		}
		return neighbourIds;
	}
	incidentEdges(nodeId: string, direction: EdgeDirection = "out"): string[] {
		const edgeIds: string[] = [];
		if (direction === "in" || direction === "both") {
			const incomingEdges = this.nodeIncomingEdges.get(nodeId);
			if (incomingEdges !== undefined) {
				edgeIds.push(...incomingEdges);
			}
		}
		if (direction === "out" || direction === "both") {
			const outgoingEdges = this.nodeOutgoingEdges.get(nodeId);
			if (outgoingEdges !== undefined) {
				edgeIds.push(...outgoingEdges);
			}
		}
		return edgeIds;
	}
}
