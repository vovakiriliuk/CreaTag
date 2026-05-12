export class Selectors {
  private selectors: Record<string, Function> = {};

  addSelector(selectorName: string, selectorFn: Function) {
    this.selectors[selectorName] = selectorFn;
  }

  getSelector(selectorName: string) {
    return this.selectors[selectorName];
  }

  select(selectorName: string, state: any) {
    const selectorFn = this.getSelector(selectorName);
    if (selectorFn) {
      return selectorFn(state);
    }
    throw new Error(`Selector ${selectorName} not found`);
  }
}
