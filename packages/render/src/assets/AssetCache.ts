import type * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export type AssetManifest<K extends string = string> = Record<K, string>;

export class AssetCache<K extends string = string> {
	private readonly loader = new GLTFLoader();
	private readonly cache = new Map<K, THREE.Object3D>();

	constructor(private readonly manifest: AssetManifest<K>) {}

	get(key: K): THREE.Object3D {
		const cached = this.cache.get(key);
		if (cached === undefined) {
			throw new Error(`no asset with key '${key}' was preloaded.`);
		}

		return cached.clone();
	}

	async preload(keys: K[], onProgress?: (loaded: number, total: number) => void): Promise<void> {
		let loaded = 0;
		await Promise.all(
			keys.map(async (key) => {
				const url = this.manifest[key];
				if (!url) throw new Error(`no asset registered for key '${key}'`);

				const cached = await this.loader
					.loadAsync(url)
					.then((gltf) => gltf.scene)
					.catch((e) => {
						console.error(url, e);
						throw new Error(`failed to load asset '${key}'`);
					});
				this.cache.set(key, cached);

				onProgress?.(++loaded, keys.length);
			})
		);
	}
}
