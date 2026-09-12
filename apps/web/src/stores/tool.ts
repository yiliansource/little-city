import { defineStore } from "pinia";
import { ref } from "vue";

import { type TileCoord, TileType } from "@little-city/core";
import type { ToolType } from "@little-city/render";

export const useToolStore = defineStore("tool", () => {
	const activeToolType = ref<ToolType | null>(null);
	const selectedTileType = ref<TileType>(TileType.Road);

	const hoveredTileCoord = ref<TileCoord | null>(null);

	return {
		activeToolType,
		selectedTileType,

		hoveredTileCoord,
	};
});
