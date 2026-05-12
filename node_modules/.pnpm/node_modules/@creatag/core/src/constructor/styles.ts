import type { StyleObject } from '../types/Tag';

export function camelToKebab(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function injectStyles(className: string, styles: StyleObject, selector = `.${className}`) {
  if (typeof document === 'undefined') return;

  let css = `${selector} { `;
  const nested: { selector: string; styles: StyleObject }[] = [];

  for (const [prop, val] of Object.entries(styles)) {
    if (typeof val === 'object' && val !== null) {
      const nestedSelector = prop.startsWith('&')
        ? prop.replace('&', selector)
        : `${selector} ${prop}`;
      nested.push({ selector: nestedSelector, styles: val as StyleObject });
    } else {
      css += `${camelToKebab(prop)}: ${val}; `;
    }
  }
  css += ' } ';

  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  nested.forEach((n) => injectStyles(className, n.styles, n.selector));
}

export function deepMerge(target: any, source: any) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
