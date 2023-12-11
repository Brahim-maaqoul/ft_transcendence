export class Queue<T> {
	private items: T[];

	constructor() {
		this.items = [];
	}

	enqueue(item: T) {
		this.items.push(item);
	}

	dequeue(): T | undefined {
		return this.items.shift();
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}

	contains(item: T): boolean {
		return this.items.includes(item);
	}

	erase(item: T): void {
		const index = this.items.indexOf(item);
		if (index > -1) {
			this.items.splice(index, 1);
		}
	}
}