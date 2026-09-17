import { NavGraph } from "../graph";
import { TileGrid, tileCoord } from "../grid";
import { refreshRoadCluster, refreshWalkCluster } from "./refreshCluster";
import { type TileSaveData, type WorldSaveData, worldSaveSchema } from "./saveData";

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

	serialize(): string {
		const saveData: WorldSaveData = {
			version: 1,
			tiles: this.grid.entries().map(
				([coord, data]) =>
					({
						x: coord.x,
						z: coord.z,
						data,
					}) satisfies TileSaveData
			),
		};

		return JSON.stringify(saveData);
	}

	deserialize(s: string): void {
		const saveParseResult = worldSaveSchema.safeParse(JSON.parse(s));
		if (!saveParseResult.success) {
			const details = saveParseResult.error.issues
				.map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
				.join("; ");

			throw new Error(`malformed save data: ${details}`);
		}

		this.grid.clear();

		const saveData = saveParseResult.data;
		for (const tile of saveData.tiles) {
			this.grid.set(tileCoord(tile.x, tile.z), tile.data);
		}
	}
}
