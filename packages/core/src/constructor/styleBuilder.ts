import type { StyleObject } from '../types/Tag';
import { injectStyles, deepMerge, camelToKebab } from './styles';

export class StyleBuilder {
  private _selector: string = '';

  private static readonly _reserved = new Set([
    '_selector',
    'setSelector',
    'set',
    'merge',
    'hover',
    'focus',
    'active',
    'build',
    'toCSS',
    'inject',
    'toString',
    'create',
    '_generateCSS',
  ]);

  constructor(initialStyles?: StyleObject) {
    if (initialStyles) {
      Object.entries(initialStyles).forEach(([key, value]) => {
        (this as Record<string, any>)[key] = value instanceof StyleBuilder ? value.build() : value;
      });
    }

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, receiver);
        }

        if (StyleBuilder._reserved.has(prop as string)) {
          const val = (target as any)[prop];
          return typeof val === 'function' ? val.bind(receiver) : val;
        }

        if (prop in target) {
          return (target as Record<string, any>)[prop];
        }

        return (value: string | number | StyleObject) => {
          (target as Record<string, any>)[prop] =
            value instanceof StyleBuilder ? value.build() : value;
          return receiver;
        };
      },
    });
  }

  public setSelector(selector: string): this {
    this._selector = selector;
    return this;
  }

  public set(prop: string, value: string | number | StyleObject): this {
    (this as Record<string, any>)[prop] = value instanceof StyleBuilder ? value.build() : value;
    return this;
  }

  public hover(styles: StyleObject | StyleBuilder): this {
    return (this as any)['&:hover'](styles);
  }

  public focus(styles: StyleObject | StyleBuilder): this {
    return (this as any)['&:focus'](styles);
  }

  public active(styles: StyleObject | StyleBuilder): this {
    return (this as any)['&:active'](styles);
  }

  public merge(other: StyleObject | StyleBuilder): this {
    const s = other instanceof StyleBuilder ? other.build() : other;
    const merged = deepMerge(this.build(), s);
    Object.keys(merged).forEach((key) => {
      (this as Record<string, any>)[key] = merged[key];
    });
    return this;
  }

  public build(): StyleObject {
    const styles: StyleObject = {};
    Object.keys(this).forEach((key) => {
      if (key !== '_selector') {
        styles[key] = (this as Record<string, any>)[key];
      }
    });
    return styles;
  }

  public toCSS(selector: string = this._selector): string {
    return this._generateCSS(selector, this.build());
  }

  private _generateCSS(selector: string, styles: StyleObject): string {
    let css = selector ? `${selector} { ` : '';
    const nested: string[] = [];

    for (const [prop, val] of Object.entries(styles)) {
      if (typeof val === 'object' && val !== null) {
        const nestedSelector = prop.startsWith('&')
          ? prop.replace('&', selector)
          : selector
            ? `${selector} ${prop}`
            : prop;
        nested.push(this._generateCSS(nestedSelector, val as StyleObject));
      } else {
        css += `${camelToKebab(prop)}: ${val}; `;
      }
    }

    if (selector) css += '} ';
    return css + nested.join(' ');
  }

  public inject(
    selectorOrRules?: string | Record<string, StyleObject | StyleBuilder>,
    maybeStyles?: StyleObject | StyleBuilder,
  ): void {
    if (!selectorOrRules) {
      injectStyles('', this.build(), this._selector);
      return;
    }

    if (typeof selectorOrRules === 'string') {
      const s = maybeStyles instanceof StyleBuilder ? maybeStyles.build() : maybeStyles || {};
      injectStyles('', s as StyleObject, selectorOrRules);
    } else {
      Object.entries(selectorOrRules).forEach(([selector, s]) => {
        const stylesObj = s instanceof StyleBuilder ? s.build() : s;
        injectStyles('', stylesObj as StyleObject, selector);
      });
    }
  }

  public toString(): string {
    return this.toCSS();
  }

  public static create(initial?: StyleObject): StyleBuilder {
    return new StyleBuilder(initial);
  }

  public static inject(
    selectorOrRules: string | Record<string, StyleObject | StyleBuilder>,
    maybeStyles?: StyleObject | StyleBuilder,
  ): void {
    if (typeof selectorOrRules === 'string') {
      const s = maybeStyles instanceof StyleBuilder ? maybeStyles.build() : maybeStyles || {};
      injectStyles('', s as StyleObject, selectorOrRules);
    } else {
      Object.entries(selectorOrRules).forEach(([selector, s]) => {
        const stylesObj = s instanceof StyleBuilder ? s.build() : s;
        injectStyles('', stylesObj as StyleObject, selector);
      });
    }
  }
}

export interface StyleBuilder {
  [key: string]: any;
  setSelector(selector: string): this;
  inject(
    selectorOrRules?: string | Record<string, StyleObject | StyleBuilder>,
    maybeStyles?: StyleObject | StyleBuilder,
  ): void;
  set(prop: string, value: string | number | StyleObject): this;
  hover(styles: StyleObject | StyleBuilder): this;
  focus(styles: StyleObject | StyleBuilder): this;
  active(styles: StyleObject | StyleBuilder): this;
  merge(other: StyleObject | StyleBuilder): this;
  build(): StyleObject;
  toCSS(selector?: string): string;
  toString(): string;
}
