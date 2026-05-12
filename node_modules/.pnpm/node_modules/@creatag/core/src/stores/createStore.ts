export class Store<T> {
  private state: T;
  private listeners: Set<() => void> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  setState(newState: T) {
    this.state = newState;
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export function createStore<T>(initialState: T) {
  return new Store(initialState);
}
