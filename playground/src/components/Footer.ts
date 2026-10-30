import { Definer } from "@creatag/core";

const d = new Definer();

export const Footer = d.define('footer', {
  textAlign: 'center',
  padding: '2rem',
  background: '#1a1a1a',
  borderTop: '1px solid #333',
  marginTop: '4rem',
});