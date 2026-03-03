export class LruRenderCache<T> {
  private store = new Map<string, T>();

  constructor(private readonly capacity: number) {}

  get(key: string): T | undefined {
    const value = this.store.get(key);
    if (value === undefined) return undefined;

    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  set(key: string, value: T): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.store.set(key, value);

    if (this.store.size > this.capacity) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  clear(): void {
    this.store.clear();
  }
}
