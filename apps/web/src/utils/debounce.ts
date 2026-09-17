export interface Debounced<Args extends unknown[]> {
	(...args: Args): void;
	flush(): void;
}

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delayMs: number): Debounced<Args> {
	let handle: ReturnType<typeof setTimeout> | null = null;
	let lastArgs: Args | null = null;

	const call = (...args: Args) => {
		lastArgs = args;
		if (handle !== null) clearTimeout(handle);

		handle = setTimeout(() => {
			handle = null;
			if (lastArgs === null) return;

			fn(...lastArgs);
		}, delayMs);
	};

	const flush = () => {
		if (handle === null) return;

		clearTimeout(handle);
		handle = null;

		if (lastArgs === null) return;

		fn(...lastArgs);
	};

	return Object.assign(call, { flush });
}
