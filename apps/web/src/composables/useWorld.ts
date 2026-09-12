import { inject, provide } from "vue";

import type { World } from "@little-city/core";

import { worldKey } from "../injection-keys";

export function provideWorld(world: World): void {
	provide(worldKey, world);
}

export function useWorld(): World {
	const world = inject(worldKey);
	if (world === undefined) throw new Error("world instance not in scope");
	return world;
}
