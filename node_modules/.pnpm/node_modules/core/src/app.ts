import type { Builder } from './constructor/builder';

export class App {
  private components: Builder[] = [];

  add(component: Builder) {
    this.components.push(component);
    return this;
  }

  mount(rootSelector: string) {
    const root = document.querySelector(rootSelector);
    if (!root) {
      console.warn(`Root element ${rootSelector} not found`);
      return;
    }

    root.innerHTML = ''; // Clear once on mount
    this.components.forEach((comp) => {
      const nodes = comp.render();
      nodes.forEach((node) => root.appendChild(node));
    });
  }
}

export const createApp = () => new App();
