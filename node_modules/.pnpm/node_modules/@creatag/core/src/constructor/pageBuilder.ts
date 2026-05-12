import type { Tag } from '../types/Tag';

export interface PageData {
  title: string;
  description: string;
  content: Tag | Tag[];
}

export class PageBuilder {
  private title: string = '';
  private description: string = '';
  private content: Tag | Tag[] | null = null;

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setDescription(description: string) {
    this.description = description;
    return this;
  }

  setContent(content: Tag | Tag[]) {
    this.content = content;
    return this;
  }

  build(): PageData {
    if (typeof document !== 'undefined') {
      if (this.title) document.title = this.title;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (this.description) {
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          (metaDesc as HTMLMetaElement).name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', this.description);
      }
    }

    return {
      title: this.title,
      description: this.description,
      content: this.content || { tag: 'div', class: '', children: [] },
    };
  }
}
