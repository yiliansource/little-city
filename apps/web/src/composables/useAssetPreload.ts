import { computed, ref } from "vue";

import type { AssetCache, AssetKey } from "@little-city/render";

export function useAssetPreload(assetCache: AssetCache<AssetKey>, assetKeys: AssetKey[]) {
	const loaded = ref(0);
	const total = ref(assetKeys.length);
	const isReady = ref(false);
	const error = ref<unknown>(null);

	const progress = computed(() => (total.value === 0 ? 1 : loaded.value / total.value));

	async function start() {
		try {
			await assetCache.preload(assetKeys, (l, t) => {
				loaded.value = l;
				total.value = t;
			});

			isReady.value = true;
		} catch (e) {
			error.value = e;
		}
	}

	return {
		progress,
		isReady,
		error,

		start,
	};
}
