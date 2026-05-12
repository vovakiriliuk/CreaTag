import { Definer } from '../../constructor/definer';
import { HeadersLightStyle } from '../../types/style-types/light-theme/Headers-light-style';

export class Hn {
  private hn: any;
  private headerLevel: number;
  private text: string;

  constructor(headerLevel: number, text: string, style?: any) {
    this.headerLevel = headerLevel;
    this.text = text;
    const tagger = `h${this.headerLevel}`;
    const d = new Definer();
    this.hn = d.define(tagger, style || HeadersLightStyle[tagger])(this.text);
  }

  public getElement() {
    return this.hn;
  }
}
