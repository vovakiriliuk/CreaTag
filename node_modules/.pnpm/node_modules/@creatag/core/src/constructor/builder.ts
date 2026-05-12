import type { Tag, Reactive } from '../types/Tag';
import { effect } from './signal';
import { injectStyles } from './styles';

export class Builder {
  private tags: Tag[];
  private nodes: HTMLElement[] = [];

  constructor(tags: Tag[]) {
    this.tags = tags;
  }

  render(): HTMLElement[] {
    this.nodes = this.tags.map((tag) => this.createNode(tag));
    return this.nodes;
  }

  private createNode(tag: Tag): HTMLElement {
    const el = document.createElement(tag.tag);
    el.className = tag.class;

    if (tag.style) {
      let hasNested = false;
      for (const [prop, value] of Object.entries(tag.style)) {
        if (typeof value === 'object' && value !== null) {
          hasNested = true;
        } else {
          (el.style as any)[prop] = value;
        }
      }

      if (hasNested) {
        const instanceId = Math.random().toString(36).slice(2, 7);
        const instanceClass = `ct-inst-${instanceId}`;
        el.classList.add(instanceClass);
        injectStyles(instanceClass, tag.style);
      }
    }

    if (tag.props) {
      for (const [key, value] of Object.entries(tag.props)) {
        if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.toLowerCase().substring(2);
          el.addEventListener(eventName, value);
        } else {
          this.bindReactive(value, (val) => {
            if (key === 'value' && el instanceof HTMLInputElement) {
              el.value = val;
            } else if (val === undefined || val === null) {
              el.removeAttribute(key);
            } else {
              el.setAttribute(key, String(val));
            }
          });
        }
      }
    }

    if (tag.text !== undefined) {
      this.bindReactive(tag.text, (val) => {
        el.textContent = val;
      });
    }

    if (tag.children !== undefined) {
      this.bindReactive(tag.children, (children) => {
        if (!children || (Array.isArray(children) && children.length === 0)) {
          if (tag.text === undefined) {
            el.innerHTML = '';
          }
          return;
        }
        el.innerHTML = '';
        children.forEach((childTag) => {
          el.appendChild(this.createNode(childTag));
        });
      });
    }

    return el;
  }

  private bindReactive<T>(reactive: Reactive<T>, updateFn: (val: T) => void) {
    if (typeof reactive === 'function') {
      effect(() => {
        updateFn((reactive as () => T)());
      });
    } else {
      updateFn(reactive);
    }
  }
}
