import { Builder, Navbar } from "@creatag/core";

export const Header = new Builder([
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