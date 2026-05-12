import { signal } from '../constructor/signal';

export const creaWindowSize = () => {
  const width = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      width.value = window.innerWidth;
    });
  }

  return { width };
};
