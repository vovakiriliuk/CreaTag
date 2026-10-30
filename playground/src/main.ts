import { currentPageContent } from './routing';
import './style.css';
import { createApp, Text, Builder, ButtonComponent } from '@creatag/core';
import { themeBuilder } from '@creatag/core'
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const app = createApp();

new themeBuilder()
    .setFont('Arial','16px','400')
    .setColorScheme('#000','#6382ab','#c7d2dd','green')
    .inject()

const main = new Builder([
  {
    tag: 'main',
    class: 'page-wrapper',
    children: () => [currentPageContent.value],
  },
]);

const footer = new Builder([
  Footer([
    Text({ text: 'CreaTag is a simple reactive UI library built with TypeScript.' }),
    new ButtonComponent('Click on me').getElement(),
  ]),
]);

app.add(Header);
app.add(main);
app.add(footer);
app.mount('#app');
