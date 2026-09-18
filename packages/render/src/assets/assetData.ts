import {
	classifyPark,
	classifyRoad,
	computeParkNeighbourhood,
	computeSideConnectivityBitmask,
	type TileCoord,
	type TileGrid,
	tileConnectivity,
} from "@little-city/core";

import type { AssetKey } from "./assetKeys";
import { parkClassificationToAssetKey, roadClassificationToAssetKey } from "./assetLookup";

export interface AssetData {
	assetKey: AssetKey;
	rotation: number;
}

export function getRoadTileAsset(grid: TileGrid, coord: TileCoord): AssetData {
	const mask = computeSideConnectivityBitmask(grid, coord, tileConnectivity);
	const classification = classifyRoad(mask);
	if (classification === undefined) throw new Error("invalid road classification");

	return {
		assetKey: roadClassificationToAssetKey(classification),
		rotation: classification.rotation,
	};
}

export function getParkTileAsset(grid: TileGrid, coord: TileCoord): AssetData {
	const neighbourhood = computeParkNeighbourhood(grid, coord);
	const classification = classifyPark(neighbourhood);
	if (classification === undefined) throw new Error("invalid park classification");

	return {
		assetKey: parkClassificationToAssetKey(classification),
		rotation: classification.rotation,
	};
}
