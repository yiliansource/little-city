import {
	assertUnreachable,
	type ParkClassification,
	ParkType,
	type RoadClassification,
	RoadType,
} from "@little-city/core";

import type { ParkAssetKey, RoadAssetKey } from "./assetKeys";

export function roadClassificationToAssetKey(classification: RoadClassification): RoadAssetKey {
	if (classification.type === RoadType.Isolated) return "road_isolated";
	if (classification.type === RoadType.DeadEnd) return "road_deadend";
	if (classification.type === RoadType.Curve) return "road_curve";
	if (classification.type === RoadType.Straight) return "road_straight";
	if (classification.type === RoadType.TJunction) return "road_tjunction";
	if (classification.type === RoadType.Cross) return "road_cross";

	assertUnreachable(classification.type);
}

export function parkClassificationToAssetKey(classification: ParkClassification): ParkAssetKey {
	if (classification.type === ParkType.None) return "park_none";
	if (classification.type === ParkType.Park) return "park_base";
	if (classification.type === ParkType.WallEntry) return "park_wall_entry";
	if (classification.type === ParkType.WallStraight) return "park_wall_straight";
	if (classification.type === ParkType.WallInnerCorner) return "park_wall_innercorner";
	if (classification.type === ParkType.WallOuterCorner) return "park_wall_outercorner";
	if (classification.type === ParkType.PathStraight) return "park_path_straight";
	if (classification.type === ParkType.PathCurve) return "park_path_curve";
	if (classification.type === ParkType.PathTJunction) return "park_path_tjunction";
	if (classification.type === ParkType.PathCross) return "park_path_cross";

	assertUnreachable(classification.type);
}
