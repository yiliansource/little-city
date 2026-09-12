<script setup lang="ts">
import type { Icon } from "@tabler/icons-vue";

defineProps<{
	icon?: Icon;
	label?: string;
	active?: boolean;
	disabled?: boolean;
}>();

defineEmits<{ click: [] }>();
</script>

<template>
	<button
		type="button"
		:disabled="disabled"
		class="flex flex-row items-center h-9 rounded-lg"
		:class="[
            disabled ? 'text-foreground-disabled' : 'text-foreground',
            active && 'bg-white/14!',
            !disabled && 'cursor-pointer hover:bg-white/8',
			!label && 'w-9'
        ]"
		@click="$emit('click')"
	>
		<component class="mx-2" :is="icon" :size="20" />
		<p class="text-sm">{{ label }}</p>
	</button>
</template>
