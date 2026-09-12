<script setup lang="ts">
import { ref } from "vue";

import { useWorldRenderer } from "../composables/useWorldRenderer";

const containerRef = ref<HTMLElement | undefined>(undefined);
useWorldRenderer(containerRef);
</script>

<template>
	<div ref="containerRef" class="w-dvw h-dvh"></div>
</template>
