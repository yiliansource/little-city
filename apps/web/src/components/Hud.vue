<script setup lang="ts">
import {
	IconBuilding,
	IconPointer,
	IconRoad,
	IconSquarePlus,
	IconTrafficLights,
	IconTrash,
	IconTree,
	IconWalk,
} from "@tabler/icons-vue";

import { TileType } from "@little-city/core";
import { ToolType } from "@little-city/render";

import { useToolStore } from "../stores/tool.js";
import Panel from "./common/Panel.vue";
import ToolButton from "./common/ToolButton.vue";

const toolStore = useToolStore();
</script>

<template>
	<div class="fixed inset-0 select-none pointer-events-none">
		<div class="m-3 md:m-6 absolute bottom-0 left-0">
			<h1 class="text-4xl md:text-6xl tracking-wide font-display font-semibold">Little City</h1>
		</div>

		<div class="m-2 md:m-4 absolute left-0 top-0 flex flex-row gap-2 md:gap-3">
			<Panel class="mb-auto pointer-events-auto">
				<ToolButton
					:icon="IconPointer"
					:active="toolStore.activeToolType === ToolType.Select"
					@click="toolStore.activeToolType = ToolType.Select"
				/>
				<ToolButton
					:icon="IconSquarePlus"
					:active="toolStore.activeToolType === ToolType.Place"
					@click="toolStore.activeToolType = ToolType.Place"
				/>
				<ToolButton
					:icon="IconTrash"
					:active="toolStore.activeToolType === ToolType.Delete"
					@click="toolStore.activeToolType = ToolType.Delete"
				/>

				<div class="mx-1 my-1 border-t border-panel-border"></div>

				<ToolButton :icon="IconTrafficLights" disabled />
				<ToolButton :icon="IconWalk" disabled />
			</Panel>

			<div class="flex flex-col items-start gap-2 md:gap-3">
				<Panel class="pointer-events-auto" v-if="toolStore.activeToolType !== null">
					<p class="mx-1 text-sm text-foreground-muted">
						Selected tool:
						<span class="text-foreground font-semibold">{{
							Object.keys(ToolType)[Object.values(ToolType).indexOf(toolStore.activeToolType)]
						}}</span>
					</p>
				</Panel>
				<Panel v-if="toolStore.activeToolType === ToolType.Place" class="min-w-34 pointer-events-auto">
					<ToolButton
						:icon="IconRoad"
						label="Road"
						:active="toolStore.selectedTileType === TileType.Road"
						@click="toolStore.selectedTileType = TileType.Road"
					/>
					<ToolButton
						:icon="IconTree"
						label="Park"
						disabled
						:active="toolStore.selectedTileType === TileType.Park"
						@click="toolStore.selectedTileType = TileType.Park"
					/>
					<ToolButton
						:icon="IconBuilding"
						label="House"
						disabled
						:active="toolStore.selectedTileType === TileType.House"
						@click="toolStore.selectedTileType = TileType.House"
					/>
				</Panel>
			</div>
		</div>
	</div>
</template>
