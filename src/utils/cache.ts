interface CacheItem<T> {
  value: T;
  expiry: number;
}

class Cache {
  private store: Map<string, CacheItem<any>>;

  constructor() {
    this.store = new Map();
    this.startCleanupInterval();
  }

  set<T>(key: string, value: T, ttl: number): void {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.store.entries()) {
        if (now > item.expiry) {
          this.store.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }
}

export const cache = new Cache();