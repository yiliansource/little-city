// import { neighborCoord, SIDES } from "../grid/coords";
// import type { TileGrid } from "../grid/TileGrid";
// import type { TileCoord } from "../grid/types";
// import { LaneGraph } from "./NavGraph";
// import type { LaneEdge, LaneNode } from "./types";

// function laneNodeId(from: TileCoord, to: TileCoord): string {
// 	return `lane:${from.x},${from.z}->${to.x},${to.z}`;
// }

// function makeNode(from: TileCoord, to: TileCoord): LaneNode {
// 	return {
// 		id: laneNodeId(from, to),
// 		fromTile: from,
// 		toTile: to,
// 	};
// }

// export class GraphBuilder {
// 	readonly graph = new LaneGraph();

// 	constructor(private grid: TileGrid) {
// 		grid.events.on("tilePlaced", (e) => this.rebuildAround(e.x, e.z));
// 		grid.events.on("tileRemoved", (e) => this.rebuildAround(e.x, e.z));
// 	}

// 	/** A change to one tile can add/remove connections on its neighbors too,
// 	 *  so rebuild the tile itself plus all four sides around it. */
// 	private rebuildAround(x: number, z: number): void {
// 		this.rebuildTile(x, z);
// 		for (const side of SIDES) {
// 			const n = neighborCoord(x, z, side);
// 			this.rebuildTile(n.x, n.z);
// 		}
// 	}

// 	private rebuildTile(x: number, z: number): void {
// 		this.graph.clearTileEdges(x, z);
// 		if (!this.grid.isRoad(x, z)) return;

// 		const self = { x, z };
// 		const connectedSides = SIDES.filter((side) => {
// 			const n = neighborCoord(x, z, side);
// 			return this.grid.isRoad(n.x, n.z);
// 		});

// 		for (const side of connectedSides) {
// 			const neighbor = neighborCoord(x, z, side);
// 			this.graph.upsertNode(makeNode(self, neighbor));
// 			this.graph.upsertNode(makeNode(neighbor, self));
// 		}

// 		// every pair of connected sides gets a directed connector, both ways —
// 		// this is what makes straight/corner/intersection fall out automatically
// 		for (const a of connectedSides) {
// 			for (const b of connectedSides) {
// 				if (a === b) continue;
// 				const from = neighborCoord(x, z, a);
// 				const to = neighborCoord(x, z, b);
// 				const entry = laneNodeId(from, self);
// 				const exit = laneNodeId(self, to);
// 				const edge: LaneEdge = {
// 					id: `${entry}=>${exit}`,
// 					from: entry,
// 					to: exit,
// 					tile: self,
// 					length: 1,
// 				};
// 				this.graph.addEdge(edge);
// 			}
// 		}
// 	}
// }
