import * as THREE from "three";

import { EventBus, type TileCoord, type TileType, tileCoordEquals, type World } from "@little-city/core";

import { worldToTileCoord } from "../common/coords";
import type { TileIndicatorSystem } from "../systems/TileIndicatorSystem";
import { DestroyTileTool, PlaceTileTool, SelectTileTool, type Tool } from "./tools";

export enum ToolType {
	Select = "select",
	Place = "place",
	Delete = "delete",
}

export interface ToolControllerEvents {
	hoveredTileChanged: TileCoord | null;
}

export class ToolController {
	readonly events = new EventBus<ToolControllerEvents>();

	private pointerDownPos: THREE.Vector2 | null = null;
	private hoveredCoord: TileCoord | null = null;
	private activeTool: Tool | null = null;

	private readonly tools: Record<ToolType, Tool>;

	private readonly raycaster = new THREE.Raycaster();
	private readonly screenPosition = new THREE.Vector2();
	private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
	private readonly intersectionPoint = new THREE.Vector3();

	constructor(
		world: World,
		private readonly domElement: HTMLElement,
		private readonly rayCamera: THREE.Camera,
		indicator: TileIndicatorSystem
	) {
		this.tools = {
			[ToolType.Select]: new SelectTileTool(world, indicator),
			[ToolType.Place]: new PlaceTileTool(world, indicator),
			[ToolType.Delete]: new DestroyTileTool(world, indicator),
		};

		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerLeave = this.onPointerLeave.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);

		domElement.addEventListener("pointermove", this.onPointerMove);
		domElement.addEventListener("pointerleave", this.onPointerLeave);
		domElement.addEventListener("pointerdown", this.onPointerDown);
		domElement.addEventListener("pointerup", this.onPointerUp);
	}

	setActiveToolType(type: ToolType | null): void {
		this.activeTool?.onDeactivate?.();

		if (type !== null) {
			this.activeTool = this.tools[type];
			this.activeTool.onHover(this.hoveredCoord);
		} else {
			this.activeTool = null;
		}
	}

	setSelectedTileType(type: TileType | null): void {
		(this.tools[ToolType.Place] as PlaceTileTool).setTileType(type);
	}

	private screenToTileCoord(x: number, y: number): TileCoord | null {
		this.screenPosition.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
		this.raycaster.setFromCamera(this.screenPosition, this.rayCamera);

		const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.intersectionPoint);

		return hit !== null ? worldToTileCoord(this.intersectionPoint) : null;
	}

	private setHoveredCoord(coord: TileCoord | null): void {
		if (tileCoordEquals(coord, this.hoveredCoord)) return;

		this.hoveredCoord = coord;
		this.activeTool?.onHover(coord);

		this.events.emit("hoveredTileChanged", coord);
	}

	private onPointerMove(e: PointerEvent) {
		const coord = this.screenToTileCoord(e.clientX, e.clientY);
		this.setHoveredCoord(coord);
	}
	private onPointerLeave() {
		this.setHoveredCoord(null);
	}
	private onPointerDown(e: PointerEvent) {
		this.pointerDownPos = new THREE.Vector2(e.clientX, e.clientY);
	}
	private onPointerUp(e: PointerEvent) {
		if (this.pointerDownPos === null) return;

		const delta = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
		this.pointerDownPos = null;

		if (delta > 5) return;
		if (this.hoveredCoord === null) return;

		this.activeTool?.onClick(this.hoveredCoord);
		this.activeTool?.onHover(this.hoveredCoord);
	}

	dispose(): void {
		this.domElement.removeEventListener("pointermove", this.onPointerMove);
		this.domElement.removeEventListener("pointerleave", this.onPointerLeave);
		this.domElement.removeEventListener("pointerdown", this.onPointerDown);
		this.domElement.removeEventListener("pointerup", this.onPointerUp);
	}
}
