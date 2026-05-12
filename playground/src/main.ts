import { currentPageContent } from './routing';
import './style.css';
import { createApp, Text, Builder, Definer, Navbar } from '@creatag/core';

const app = createApp();

const d = new Definer();

const Footer = d.define('footer', {
  textAlign: 'center',
  padding: '2rem',
  background: '#1a1a1a',
  borderTop: '1px solid #333',
  marginTop: '4rem',
});

const header = new Builder([
  Navbar({
    brand: { text: 'CreaTag', href: '/' },
    links: [
      { text: 'Home', href: '/' },
      { text: 'Features', href: '/features' },
      { text: 'Pricing', href: '/pricing' },
      { text: 'About', href: '/about' },
    ],
  }),
]);

const main = new Builder([
  {
    tag: 'div',
    class: 'page-wrapper',
    children: () => [currentPageContent.value],
  },
]);

const footer = new Builder([
  Footer([Text({ text: 'CreaTag is a simple reactive UI library built with TypeScript.' })]),
]);

app.add(header);
app.add(main);
app.add(footer);
app.mount('#app');
