import type * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export type AssetManifest<K extends string = string> = Record<K, string>;

export class AssetCache<K extends string = string> {
	private readonly loader = new GLTFLoader();
	private readonly cache = new Map<K, Promise<THREE.Object3D>>();

	constructor(private readonly manifest: AssetManifest<K>) {}

	async get(key: K): Promise<THREE.Object3D> {
		let pending = this.cache.get(key);
		if (!pending) {
			const url = this.manifest[key];
			if (!url) {
				throw new Error(`no asset registered for key '${key}'`);
			}

			pending = this.loader
				.loadAsync(url)
				.then((gltf) => gltf.scene)
				.catch(() => {
					throw new Error(`failed to load asset '${key}'`);
				});
			this.cache.set(key, pending);
		}

		return (await pending).clone();
	}

	async preload(keys: K[], onProgress?: (loaded: number, total: number) => void): Promise<void> {
		let loaded = 0;
		await Promise.all(
			keys.map(async (key) => {
				await this.get(key);
				onProgress?.(++loaded, keys.length);
			})
		);
	}
}
