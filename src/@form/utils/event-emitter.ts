type Callback<T = any> = (payload: T) => void;

class FormEventEmitter {
  private events: Record<string, Callback[]> = {};

  on(event: string, callback: Callback): VoidFunction {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: Callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event: string, payload?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((cb) => cb(payload));
  }
}

export const formEventEmitter = new FormEventEmitter();