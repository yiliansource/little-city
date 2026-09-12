import type { AssetKey, AssetManifest } from "@little-city/render";

import { buildingManifest } from "./buildingManifest";
import { parkManifest } from "./parkManifest";
import { roadManifest } from "./roadManifest";

export const assetManifest: AssetManifest<AssetKey> = {
	...roadManifest,
	...buildingManifest,
	...parkManifest,
};
