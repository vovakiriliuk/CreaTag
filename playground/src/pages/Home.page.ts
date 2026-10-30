import { InputComponent, ButtonComponent, Text, Definer } from '@creatag/core';
import { title, count, stext, h4text } from '../state';
import { container } from '../styles/container-style';
const d = new Definer();

const Container = d.define('div', {
  ...container
});

export const homeContent = Container([
  { tag: 'h1', class: '', text: () => title.value, children: [] },
  { tag : 'h2',class: '',text: () => stext.value, children: [] },
  { tag : 'h4',class: '',text: () => h4text.value, children: [] },

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

  new InputComponent({
    placeholder: 'Enter new title',
    value: () => stext.value,
    inputType: 'number',
    onInput: (value) => {
      stext.value = value;
    }})
  .getElement(),
  new InputComponent({
    placeholder: 'Enter new title',
    value: () => stext.value,
    inputType: 'text',
    onInput: (value) => {
      h4text.value = value;
    }})
  .getElement()
]);
