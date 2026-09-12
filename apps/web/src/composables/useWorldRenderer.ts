import { onMounted, onUnmounted, type Ref, shallowRef, watch } from "vue";

import { WorldRenderer } from "@little-city/render";

import { useToolStore } from "../stores/tool";
import { useWorld } from "./useWorld";

export function useWorldRenderer(containerRef: Ref<HTMLElement | undefined>): Readonly<Ref<WorldRenderer | undefined>> {
	const rendererRef = shallowRef<WorldRenderer>();

	const world = useWorld();
	const tools = useToolStore();

	const unsubscribes: (() => void)[] = [];

	onMounted(() => {
		if (containerRef.value === undefined) {
			throw new Error("invalid renderer container reference");
		}

		const renderer = new WorldRenderer(containerRef.value, world);
		rendererRef.value = renderer;

		unsubscribes.push(
			watch(
				() => tools.selectedTileType,
				(type) => renderer.placementController.setSelectedTileType(type),
				{ immediate: true }
			),
			watch(
				() => tools.activeToolType,
				(type) => renderer.placementController.setActiveToolType(type),
				{ immediate: true }
			),
			renderer.placementController.events.on("hoveredTileChanged", (coord) => (tools.hoveredTileCoord = coord))
		);

		renderer.start();
	});

	onUnmounted(() => {
		while (unsubscribes.length > 0) {
			const unsubscribe = unsubscribes.pop();
			unsubscribe?.();
		}

		rendererRef.value?.dispose();
	});

	return rendererRef;
}
