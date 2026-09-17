import { onUnmounted } from "vue";

import type { World } from "@little-city/core";

import { debounce } from "../utils/debounce";

const STORAGE_KEY = "little-city:world";
const SAVE_DEBOUNCE_MS = 5000;

export function saveWorld(world: World): void {
	try {
		localStorage.setItem(STORAGE_KEY, world.serialize());
	} catch (e) {
		console.error("failed to save world to storage", e);
	}
}

export function loadWorld(world: World): boolean {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === null) return false;

		world.deserialize(raw);
		return true;
	} catch (e) {
		console.error("failed to load saved world from storage, starting fresh", e);
		return false;
	}
}

export function useWorldAutosave(world: World): void {
	const debouncedSave = debounce(() => saveWorld(world), SAVE_DEBOUNCE_MS);

	const unsubscribes = [
		world.grid.events.on("tilePlaced", debouncedSave),
		world.grid.events.on("tileDeleted", debouncedSave),
	];

	const flushOnHide = () => {
		if (document.visibilityState === "hidden") debouncedSave.flush();
	};

	window.addEventListener("beforeunload", debouncedSave.flush);
	document.addEventListener("visibilitychange", flushOnHide);

	onUnmounted(() => {
		for (const unsubscribe of unsubscribes) unsubscribe();

		window.removeEventListener("beforeunload", debouncedSave.flush);
		document.removeEventListener("visibilitychange", flushOnHide);

		debouncedSave.flush();
	});
}
