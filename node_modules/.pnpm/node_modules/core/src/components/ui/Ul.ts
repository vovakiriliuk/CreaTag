import { Definer } from '../../constructor/definer';

const d = new Definer();

export class Ul {
  private ul: any;
  private children: any[];

  constructor(children: any[], style?: any) {
    this.children = children;
    this.ul = d.define('ul', style || {})(this.children);
  }

  public getElement() {
    return this.ul;
  }
}
