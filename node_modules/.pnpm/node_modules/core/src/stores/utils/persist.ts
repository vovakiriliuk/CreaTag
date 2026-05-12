export class Persist {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  saveState(state: any) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serializedState);
    } catch (err) {
      console.error('Error saving state to localStorage', err);
    }
  }

  loadState() {
    try {
      const serializedState = localStorage.getItem(this.storageKey);
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('Error loading state from localStorage', err);
      return undefined;
    }
  }

  clearState() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.error('Error clearing state from localStorage', err);
    }
  }
}

export function createPersist(storageKey: string) {
  return new Persist(storageKey);
}
