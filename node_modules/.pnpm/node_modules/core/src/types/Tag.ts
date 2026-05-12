export type Reactive<T> = T | (() => T);

export interface StyleObject {
  [property: string]: string | number | StyleObject;
}

export interface TagProps {
  [key: string]: any;
  style?: StyleObject;
  styles?: StyleObject;
  onClick?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}

export type Tag = {
  tag: string;
  class: string;
  style?: StyleObject;
  [style: string]: any;
  props?: TagProps;
  text?: Reactive<string>;
  children?: Reactive<Tag[]>;
  links?: { text: string; href: string }[];
};
