import type { InjectionKey } from "vue";

import type { World } from "@little-city/core";
import type { AssetCache, AssetKey } from "@little-city/render";

export const worldKey: InjectionKey<World> = Symbol("world");
export const assetCacheKey: InjectionKey<AssetCache<AssetKey>> = Symbol("assetCache");
