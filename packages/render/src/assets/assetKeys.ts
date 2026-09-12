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

export const parkAssetKeys = [] as const;
export type ParkAssetKey = (typeof parkAssetKeys)[number];

export type AssetKey = RoadAssetKey | BuildingAssetKey | ParkAssetKey;
export const allAssetKeys = [...roadAssetKeys, ...buildingAssetKeys, ...parkAssetKeys] as const satisfies AssetKey[];
