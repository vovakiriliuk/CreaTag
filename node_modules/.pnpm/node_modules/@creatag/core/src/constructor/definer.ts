import type { Tag, TagProps, Reactive, StyleObject } from '../types/Tag';
import { injectStyles, deepMerge } from './styles';

export type TagFactory = ((
  propsOrTextOrChildren?: (Partial<Tag> & TagProps) | string | Tag[],
  children?: Tag[],
) => Tag) & {
  extend: (newStyles: StyleObject) => TagFactory;
};

export class Definer {
  define(tagName: string, styles: StyleObject): TagFactory {
    const id = Math.random().toString(36).slice(2, 7);
    const className = `ct-${tagName}-${id}`;

    injectStyles(className, styles);

    const factory = ((
      propsOrTextOrChildren?: (Partial<Tag> & TagProps) | string | Tag[],
      children?: Tag[],
    ) => {
      let tagProps: TagProps | undefined;
      let text: Reactive<string> | undefined;
      let childTags: Reactive<Tag[]> | undefined;
      let instanceStyle: StyleObject | undefined;

      if (
        typeof propsOrTextOrChildren === 'string' ||
        typeof propsOrTextOrChildren === 'function'
      ) {
        text = propsOrTextOrChildren as Reactive<string>;
        childTags = children;
      } else if (Array.isArray(propsOrTextOrChildren)) {
        childTags = propsOrTextOrChildren as Tag[];
      } else if (typeof propsOrTextOrChildren === 'object' && propsOrTextOrChildren !== null) {
        const p = propsOrTextOrChildren as any;
        if (p.tag && p.class) {
          childTags = [p as Tag];
        } else {
          tagProps = p.props;
          text = p.text;
          childTags = p.children;
          instanceStyle = p.style || p.styles;

          const {
            text: _t,
            children: _c,
            props: _p,
            tag: _tg,
            class: _cl,
            style: _s,
            styles: _ss,
            ...rest
          } = p;
          if (Object.keys(rest).length > 0) {
            tagProps = { ...tagProps, ...rest };
          }
        }
      }

      return {
        tag: tagName,
        class: className,
        props: tagProps,
        text: text,
        children: childTags,
        style: instanceStyle,
      };
    }) as TagFactory;

    factory.extend = (newStyles: StyleObject) => {
      return this.define(tagName, deepMerge(styles, newStyles));
    };

    return factory;
  }
}
