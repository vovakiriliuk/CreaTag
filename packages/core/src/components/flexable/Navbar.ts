import { Definer } from '../../constructor/definer';
import { signal } from '../../constructor/signal';
import { creaWindowSize } from '../../composables/creaWindowSize';
import {
  NavbarLightStyle,
  NavLinksStyle,
  MobileMenuStyle,
} from '../../types/style-types/light-theme/Navbar-light-style';
import { BurgerLightStyle } from '../../types/style-types/light-theme/Burger-light-style';
import { LinkLightStyle } from '../../types/style-types/light-theme/Link-light-style';

const d = new Definer();

const NavBase = d.define('nav', NavbarLightStyle);
const NavLinks = d.define('ul', NavLinksStyle);
const MobileMenu = d.define('div', MobileMenuStyle);
const BurgerBtn = d.define('button', BurgerLightStyle);
const BurgerLine = d.define('div', {});
const Brand = d.define('a', {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
});

export const Navbar = (props: {
  brand: { text: string; href: string };
  links: { text: string; href: string }[];
  style?: any;
}) => {
  const { width } = creaWindowSize();
  const isOpen = signal(false);

  return NavBase({
    style: props.style,
    children: () => {
      const isMobile = width.value <= 768;

      const desktopLinks = NavLinks(
        props.links.map((link) => ({
          tag: 'li',
          class: '',
          children: [
            {
              tag: 'a',
              class: '',
              props: { href: link.href },
              text: link.text,
              style: LinkLightStyle,
            },
          ],
        })),
      );

      const burger = BurgerBtn({
        onClick: () => {
          isOpen.value = !isOpen.value;
        },
        children: [
          BurgerLine({ style: isOpen.value ? { transform: 'rotate(45deg)' } : {} }),
          BurgerLine({
            style: isOpen.value ? { opacity: '0', transform: 'translateX(20px)' } : {},
          }),
          BurgerLine({ style: isOpen.value ? { transform: 'rotate(-45deg)' } : {} }),
        ],
      });

      const mobileMenu = isOpen.value
        ? MobileMenu(
            props.links.map((link) => ({
              tag: 'a',
              class: '',
              props: { href: link.href },
              text: link.text,
              style: LinkLightStyle,
              children: [],
            })),
          )
        : null;

      const children: any[] = [
        Brand({ text: props.brand.text, props: { href: props.brand.href } }),
        isMobile ? burger : desktopLinks,
      ];

      if (isMobile && mobileMenu) {
        children.push(mobileMenu);
      }

      return children;
    },
  });
};
