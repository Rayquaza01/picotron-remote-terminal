export class Queue<T> {
    private queue: T[] = [];
    private waitlist: Record<"resolve" | "reject", (arg0?: T) => void>[] = [];

    enqueue(value: T) {
        this.queue.push(value);

        if (this.waitlist.length > 0 && this.queue.length > 0) {
            this.waitlist.shift()?.resolve(this.queue.shift());
        }
    }

    async dequeue(): Promise<T | undefined> {
        if (this.queue.length > 0) {
            return Promise.resolve(this.queue.shift())
        } else {
            return new Promise((resolve, reject) => {
                this.waitlist.push({ resolve, reject });
            });
        }
    }

    get length(): number {
        return this.queue.length;
    }

    clear_waitlist() {
        while (this.waitlist.length > 0) {
            this.waitlist.shift()?.reject();
        }
    }
}
