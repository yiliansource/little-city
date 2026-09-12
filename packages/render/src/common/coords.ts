import * as THREE from "three";

import { type TileCoord, tileCoord } from "@little-city/core";

export function tileCoordToWorld(coord: TileCoord): THREE.Vector3 {
	return new THREE.Vector3(coord.x, 0, coord.z);
}

export function worldToTileCoord(world: THREE.Vector3): TileCoord {
	return tileCoord(Math.round(world.x), Math.round(world.z));
}
