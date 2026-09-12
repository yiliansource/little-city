import { inject, provide } from "vue";

import type { AssetCache, AssetKey } from "@little-city/render";

import { assetCacheKey } from "../injection-keys";

export function provideAssetCache(cache: AssetCache<AssetKey>): void {
	provide(assetCacheKey, cache);
}

export function useAssetCache(): AssetCache<AssetKey> {
	const cache = inject(assetCacheKey);
	if (cache === undefined) throw new Error("asset cache instance not in scope");
	return cache;
}
