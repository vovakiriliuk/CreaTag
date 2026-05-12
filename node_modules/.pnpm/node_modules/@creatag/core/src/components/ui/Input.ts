import { InputLightStyle } from '../../types/style-types/light-theme/Input-light-style';
import { Definer } from '../../constructor/definer';
import type { Tag, Reactive } from '../../types/Tag';
import { signal, Signal } from '../../constructor/signal';

const Input = new Definer().define('input', InputLightStyle);

export class InputComponent {
  private input: Tag;
  private inputTypeSignal: Signal<string>;

  constructor(props: {
    inputType?: string;
    placeholder?: string;
    value?: Reactive<string>;
    onInput?: (value: string) => void;
  }) {
    this.inputTypeSignal = signal(props.inputType || 'text');
    this.input = Input({
      props: {
        type: () => this.inputTypeSignal.value,
        placeholder: props.placeholder,
        value: props.value,
        onInput: (e: any) => {
          if (props.onInput) {
            props.onInput(e.target.value);
          }
        },
      },
    });
  }

  setInputType(type: string) {
    this.inputTypeSignal.value = type;
  }

  public getElement(): Tag {
    return this.input;
  }
}
