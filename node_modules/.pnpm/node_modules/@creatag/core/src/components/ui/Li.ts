import { Definer } from '../../constructor/definer';

const d = new Definer();

export const Li = (props: { children: any; style?: any }) => {
  return d.define('li', props.style || {})(props.children);
};
