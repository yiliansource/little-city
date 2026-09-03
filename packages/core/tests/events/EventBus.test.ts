import { describe, expect, test } from "bun:test";

import { EventBus } from "@little-city/core";

describe("event bus", () => {
	function setup() {
		const counters = { a: 0, b: 0 };
		const bus = new EventBus<{ increment: keyof typeof counters }>();

		return { counters, bus };
	}

	test("subscribes", () => {
		const { counters, bus } = setup();
		bus.on("increment", (k) => void counters[k]++);

		bus.emit("increment", "a");
		bus.emit("increment", "b");
		bus.emit("increment", "a");

		expect(counters.a).toBe(2);
		expect(counters.b).toBe(1);
	});
	test("unsubscribes", () => {
		const { counters, bus } = setup();
		const unsubscribe = bus.on("increment", (k) => void counters[k]++);

		unsubscribe();
		bus.emit("increment", "a");
		bus.emit("increment", "b");

		expect(counters.a).toBe(0);
		expect(counters.b).toBe(0);
	});
});
