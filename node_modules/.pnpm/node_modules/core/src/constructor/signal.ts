type Listener = () => void;

let activeEffect: Listener | null = null;

export class Signal<T> {
  private _value: T;
  private subscribers = new Set<Listener>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  private notify() {
    this.subscribers.forEach(sub => sub());
  }
}

export const signal = <T>(value: T) => new Signal(value);

export const effect = (fn: Listener) => {
  activeEffect = fn;
  fn();
  activeEffect = null;
};
