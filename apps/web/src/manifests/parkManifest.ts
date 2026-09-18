import type { AssetManifest, ParkAssetKey } from "@little-city/render";

export const parkManifest: AssetManifest<ParkAssetKey> = {
	park_none: "/models/base.glb",
	park_base: "/models/park_base.glb",
	park_wall_entry: "/models/park_wall_entry.glb",
	park_wall_straight: "/models/park_wall_straight.glb",
	park_wall_innercorner: "/models/park_wall_innerCorner.glb",
	park_wall_outercorner: "/models/park_wall_outerCorner.glb",
	park_path_straight: "/models/park_road_straight.glb",
	park_path_curve: "/models/park_road_corner.glb",
	park_path_tjunction: "/models/park_road_tsplit.glb",
	park_path_cross: "/models/park_road_junction.glb",
};
