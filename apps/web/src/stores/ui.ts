import { defineStore } from "pinia";
import { ref } from "vue";

import type { TileCoord, TileData } from "@little-city/core";

export const useUiStore = defineStore("ui", () => {
	const hovered = ref<{ coord: TileCoord; tile: TileData | null } | null>(
		null,
	);
	return { hovered };
});
