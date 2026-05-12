import { signal } from '../constructor/signal';

export const creaLocalStorage = () => {
  const storage = signal(
    typeof localStorage !== 'undefined' ? localStorage.getItem('data') || '' : '',
  );

  return { storage };
};
