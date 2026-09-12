export type Listener<T> = (payload: T) => void;

export class EventBus<Events extends object> {
	private listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

	on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
		let set = this.listeners[event];
		if (set === undefined) {
			set = new Set();
			this.listeners[event] = set;
		}

		set.add(listener);

		return () => set.delete(listener);
	}

	emit<K extends keyof Events>(event: K, payload: Events[K]): void {
		this.listeners[event]?.forEach((l) => void l(payload));
	}
}
