import { Graph, type GraphEdge, type GraphNode } from "./Graph";

export interface NavGraphNode extends GraphNode {}
export interface NavGraphEdge extends GraphEdge {}

export class NavGraph extends Graph<NavGraphNode, NavGraphEdge> {}
