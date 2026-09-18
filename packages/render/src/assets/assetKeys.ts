export const roadAssetKeys = [
	"road_isolated",
	"road_deadend",
	"road_straight",
	"road_curve",
	"road_tjunction",
	"road_cross",
] as const;
export type RoadAssetKey = (typeof roadAssetKeys)[number];

export const buildingAssetKeys = [] as const;
export type BuildingAssetKey = (typeof buildingAssetKeys)[number];

export const parkAssetKeys = [
	"park_none",
	"park_base",
	"park_wall_entry",
	"park_wall_straight",
	"park_wall_innercorner",
	"park_wall_outercorner",
	"park_path_straight",
	"park_path_curve",
	"park_path_tjunction",
	"park_path_cross",
] as const;
export type ParkAssetKey = (typeof parkAssetKeys)[number];

export type AssetKey = RoadAssetKey | BuildingAssetKey | ParkAssetKey;
export const allAssetKeys = [...roadAssetKeys, ...buildingAssetKeys, ...parkAssetKeys] as const satisfies AssetKey[];
