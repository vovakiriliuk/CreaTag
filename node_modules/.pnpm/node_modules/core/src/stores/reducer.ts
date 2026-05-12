export class Reducer {
  private reducers: Record<string, Function> = {};

  addReducer(actionType: string, reducerFn: Function) {
    this.reducers[actionType] = reducerFn;
  }

  getReducer(actionType: string) {
    return this.reducers[actionType];
  }

  reduce(state: any, action: { type: string; payload?: any }) {
    const reducerFn = this.getReducer(action.type);
    if (reducerFn) {
      return reducerFn(state, action.payload);
    }
    return state;
  }
}

export function createReducer() {
  return new Reducer();
}
