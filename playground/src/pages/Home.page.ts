import { InputComponent, ButtonComponent, Text, Definer } from '@creatag/core';
import { title } from '../state';
import { count } from '../state';

const d = new Definer();

const Container = d.define('div', {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '4rem 2rem',
  textAlign: 'center',
});

export const homeContent = Container([
  { tag: 'h1', class: '', text: () => title.value, children: [] },
  Text({ text: 'Change the title below:', style: { margin: '20px 0', color: '#646cff' } }),
  new InputComponent({
    placeholder: 'Enter new title',
    value: () => title.value,
    inputType: 'text',
    onInput: (value) => {
      title.value = value;
    },
  }).getElement(),
  { tag: 'div', class: '', children: [] },
  new ButtonComponent('Click me', () => {
    count.value += 1;
  }).getElement(),
  Text({ text: () => `Button clicked ${count.value} times`, style: { marginTop: '20px' } }),
  Text.extend({ color: 'gold', fontWeight: 'bold' })({
    text: 'This is an extended Text component with gold color.',
  }),
]);
