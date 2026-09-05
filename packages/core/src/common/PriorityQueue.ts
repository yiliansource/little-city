type PriorityComparator = (a: number, b: number) => number;

interface PriorityQueueElement<T> {
	value: T;
	priority: number;
}

export class PriorityQueue<T> {
	private heap: PriorityQueueElement<T>[] = [];
	private readonly compare: PriorityComparator;

	private constructor(compare: PriorityComparator) {
		this.compare = compare;
	}

	static min<T>(): PriorityQueue<T> {
		return new PriorityQueue<T>((a, b) => a - b);
	}
	static max<T>(): PriorityQueue<T> {
		return new PriorityQueue<T>((a, b) => b - a);
	}

	get size(): number {
		return this.heap.length;
	}

	isEmpty(): boolean {
		return this.heap.length === 0;
	}

	peek(): T | undefined {
		return this.heap[0]?.value;
	}
	peekElement(): Readonly<PriorityQueueElement<T>> | undefined {
		return this.heap[0];
	}

	push(value: T, priority: number): void {
		this.heap.push({ value, priority });
		this.bubbleUp(this.heap.length - 1);
	}

	pop(): T | undefined {
		return this.popElement()?.value;
	}
	popElement(): PriorityQueueElement<T> | undefined {
		if (this.heap.length === 0) return undefined;

		const top = this.heap[0];
		const last = this.heap.pop()!;

		if (this.heap.length > 0) {
			this.heap[0] = last;
			this.bubbleDown(0);
		}

		return top;
	}

	toArray(): T[] {
		return this.heap.map((e) => e.value);
	}

	clear(): void {
		this.heap = [];
	}

	private bubbleUp(index: number): void {
		while (index > 0) {
			const parentIndex = (index - 1) >> 1;
			if (
				this.compare(
					this.heap[index]!.priority,
					this.heap[parentIndex]!.priority,
				) >= 0
			) {
				break;
			}

			this.swap(index, parentIndex);
			index = parentIndex;
		}
	}

	private bubbleDown(index: number): void {
		const length = this.heap.length;

		while (true) {
			const left = index * 2 + 1;
			const right = index * 2 + 2;
			let best = index;

			if (
				left < length &&
				this.compare(
					this.heap[left]!.priority,
					this.heap[best]!.priority,
				) < 0
			) {
				best = left;
			}
			if (
				right < length &&
				this.compare(
					this.heap[right]!.priority,
					this.heap[best]!.priority,
				) < 0
			) {
				best = right;
			}
			if (best === index) break;

			this.swap(index, best);
			index = best;
		}
	}

	private swap(i: number, j: number): void {
		[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
	}
}
