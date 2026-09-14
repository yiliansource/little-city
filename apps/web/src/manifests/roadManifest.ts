import type { AssetManifest, RoadAssetKey } from "@little-city/render";

export const roadManifest: AssetManifest<RoadAssetKey> = {
	road_isolated: "/models/base.glb",
	road_deadend: "/models/road_deadend.glb",
	road_straight: "/models/road_straight.glb",
	road_curve: "/models/road_corner.glb",
	road_tjunction: "/models/road_tsplit.glb",
	road_cross: "/models/road_junction.glb",
};
