type EventHandler = (...args: any[]) => Promise<void> | void;

export class DesiEvents {
  private static listeners: Map<string, EventHandler[]> = new Map();
  private static middleware: Map<string, EventHandler[]> = new Map();

  static pehle(event: string, handler: EventHandler) {
    console.log(`🎭 ${event} se pehle ka handler add kar rahe hain...`);
    const handlers = this.middleware.get(`pre:${event}`) || [];
    handlers.push(handler);
    this.middleware.set(`pre:${event}`, handlers);
  }

  static baadMein(event: string, handler: EventHandler) {
    console.log(`🎭 ${event} ke baad ka handler add kar rahe hain...`);
    const handlers = this.middleware.get(`post:${event}`) || [];
    handlers.push(handler);
    this.middleware.set(`post:${event}`, handlers);
  }

  static sunno(event: string, callback: EventHandler) {
    console.log(`👂 ${event} ke liye listener add kar rahe hain...`);
    const current = this.listeners.get(event) || [];
    this.listeners.set(event, [...current, callback]);
  }

  static async bolo(event: string, ...args: any[]) {
    // Run pre-event middleware
    await this.chalaoMiddleware('pre', event, ...args);

    // Run event handlers
    console.log(`🗣️ ${event} event trigger kar rahe hain...`);
    const callbacks = this.listeners.get(event) || [];
    for (const callback of callbacks) {
      await callback(...args);
    }

    // Run post-event middleware
    await this.chalaoMiddleware('post', event, ...args);
  }

  private static async chalaoMiddleware(phase: 'pre' | 'post', event: string, ...args: any[]) {
    const eventKey = `${phase}:${event}`;
    const handlers = this.middleware.get(eventKey) || [];
    
    for (const handler of handlers) {
      await handler(...args);
    }
  }

  static hatao(event: string, handler: EventHandler) {
    console.log(`🚫 ${event} ka handler hata rahe hain...`);
    const current = this.listeners.get(event) || [];
    this.listeners.set(event, current.filter(h => h !== handler));
  }
}