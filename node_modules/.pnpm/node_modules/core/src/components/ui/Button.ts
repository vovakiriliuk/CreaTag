import { ButtonLightStyle } from '../../types/style-types/light-theme/Button-light-style';
import { Definer } from '../../constructor/definer';
import type { Tag } from '../../types/Tag';

const Button = new Definer().define('button', ButtonLightStyle);

export class ButtonComponent {
  private button: Tag;

  constructor(text: string, onClick?: () => void) {
    this.button = Button({ text, onClick });
  }

  public getElement() {
    return this.button;
  }
}
