<script setup lang="ts">
import { onMounted } from "vue";

import { World } from "@little-city/core";
import { AssetCache, allAssetKeys } from "@little-city/render";

import LoadingScreen from "./components/LoadingScreen.vue";
import WorldView from "./components/WorldView.vue";
import { provideAssetCache } from "./composables/useAssetCache.js";
import { useAssetPreload } from "./composables/useAssetPreload.js";
import { provideWorld } from "./composables/useWorld.js";
import { loadWorld, useWorldAutosave } from "./composables/useWorldPersistence.js";
import { assetManifest } from "./manifests/index.js";

const world = new World();
loadWorld(world);
useWorldAutosave(world);

const assetCache = new AssetCache(assetManifest);

provideWorld(world);
provideAssetCache(assetCache);

const { progress, isReady, error, start: startAssetPreload } = useAssetPreload(assetCache, allAssetKeys);

onMounted(startAssetPreload);
</script>

<template>
	<LoadingScreen v-if="!isReady" :progress="progress" :error="error" />
	<WorldView v-else />
</template>
