import { NavGraph } from "../graph";
import { TileGrid } from "../grid";
import { refreshRoadCluster, refreshWalkCluster } from "./refreshCluster";

export class World {
	readonly grid: TileGrid;

	readonly roadGraph: NavGraph;
	readonly walkGraph: NavGraph;

	constructor() {
		this.grid = new TileGrid();

		this.roadGraph = new NavGraph();
		this.walkGraph = new NavGraph();

		this.grid.events.on("tilePlaced", ({ coord }) => {
			refreshRoadCluster(this.grid, this.roadGraph, coord);
			refreshWalkCluster(this.grid, this.walkGraph, coord);
		});
		this.grid.events.on("tileDeleted", ({ coord }) => {
			refreshRoadCluster(this.grid, this.roadGraph, coord);
			refreshWalkCluster(this.grid, this.walkGraph, coord);
		});
	}
}
