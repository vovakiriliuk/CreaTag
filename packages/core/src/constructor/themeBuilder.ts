import { StyleBuilder } from './styleBuilder';
import type { StyleObject } from '../types/Tag';

export interface FontOptions {
  family: string;
  size?: string;
  weight?: string;
  url?: string;
}

export class ThemeBuilder {
  private _rules: Record<string, StyleObject> = {};

  constructor() {
    this._rules[':root'] = {};
    this._rules['body'] = {};
  }

  setFont(family: string, size?: string, weight?: string, url?: string): this {
    if (url) {
      this._rules['@font-face'] = {
        fontFamily: `"${family}"`,
        src: `url("${url}")`,
      };
    }

    this._rules['body'] = {
      ...this._rules['body'],
      fontFamily: family,
      ...(size ? { fontSize: size } : {}),
      ...(weight ? { fontWeight: weight } : {}),
    };

    return this;
  }

  setColorScheme(
    primaryColor: string,
    secondaryColor: string,
    backgroundColor: string,
    textColor: string
  ): this {
    this._rules[':root'] = {
      ...this._rules[':root'],
      '--color-primary': primaryColor,
      '--color-secondary': secondaryColor,
      '--color-bg': backgroundColor,
      '--color-text': textColor,
    };

    this._rules['body'] = {
      ...this._rules['body'],
      backgroundColor,
      color: textColor,
    };

    this._rules['.primary'] = { color: 'var(--color-primary)' };
    this._rules['.secondary'] = { color: 'var(--color-secondary)' };
    this._rules['.primary-bg'] = { backgroundColor: 'var(--color-primary)' };
    this._rules['.secondary-bg'] = { backgroundColor: 'var(--color-secondary)' };

    return this;
  }

  setSpacing(spacing: string): this {
    this._rules['body'] = {
      ...this._rules['body'],
      margin: spacing,
      padding: spacing,
    };

    return this;
  }

  setRule(selector: string, styles: StyleObject): this {
    this._rules[selector] = {
      ...(this._rules[selector] || {}),
      ...styles,
    };
    return this;
  }

  build(): Record<string, StyleObject> {
    return this._rules;
  }

  inject(): void {
    StyleBuilder.inject(this._rules);
  }
}

export const themeBuilder = ThemeBuilder;
