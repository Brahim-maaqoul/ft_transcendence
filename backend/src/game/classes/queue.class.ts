export class Queue<T, D> {
	private items: T[];
	private data: D[];

	constructor() {
		this.items = [];
		this.data = []
	}

	enqueue(item: T, data: D) {
		this.items.push(item);
		this.data.push(data);
	}

	dequeue(): {item: T , data: D} | undefined {
		return {item: this.items.shift() , data: this.data.shift()};
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

	containsData(data: D)
	{
		const index = this.data.indexOf(data);
		if (index < 0){
			return this.data.includes(null);
		}
		return index
	}

	erase(item: T): void {
		const index = this.items.indexOf(item);
		if (index > -1) {
			this.items.splice(index, 1);
			this.data.splice(index, 1);
		}
	}
	
	getIdxData(idx: number):{item: T, data: D} | undefined{
		if (idx < 0)
			return undefined;
		const ret = {item: this.items[idx], data: this.data[idx]};
		this.erase(ret.item);
		return ret;
	}

	
}