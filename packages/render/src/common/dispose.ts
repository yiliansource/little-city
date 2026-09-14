import * as THREE from "three";

export function disposeObject3D(root: THREE.Object3D): void {
	root.traverse((obj) => {
		if (obj instanceof THREE.Mesh) {
			obj.geometry?.dispose();

			disposeMaterial(obj.material);
		}
	});
}

function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
	const materials = Array.isArray(material) ? material : [material];
	for (const mat of materials) {
		const textures = Object.values(mat).filter((p) => p instanceof THREE.Texture);
		for (const tex of textures) {
			tex.dispose();
		}
		mat.dispose();
	}
}
