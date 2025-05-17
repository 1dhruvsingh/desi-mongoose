export class DesiCache {
  private static cache = new Map();
  private static ttl = 60000; // 1 minute default

  static rakh(key: string, value: any, customTtl?: number) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (customTtl || this.ttl)
    });
  }

  static nikaal(key: string) {
    const item = this.cache.get(key);
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    this.cache.delete(key);
    return null;
  }

  static saafKaro() {
    this.cache.clear();
  }
}