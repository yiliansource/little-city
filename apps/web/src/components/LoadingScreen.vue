<script setup lang="ts">
defineProps<{ progress: number; error: unknown }>();
</script>

<template>
	<div class="fixed inset-0 grid place-items-center">
		<div class="flex flex-col">
			<div v-if="error" class="text-center">
				<p class="mb-2 text-red-400">Failed to load assets.</p>
				<p class="text-foreground-muted text-sm">{{ String(error) }}</p>
			</div>
			<template v-else>
				<p class="text-foreground-muted select-none">
					Loading assets:
					<span class="text-foreground">{{ Math.round(progress * 100) }}%</span>
				</p>
			</template>
		</div>
	</div>
</template>
