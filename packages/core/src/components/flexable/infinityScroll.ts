import { Definer, TagFactory } from '../../constructor/definer';
import { Tag } from '../../types/Tag';

const d = new Definer();

export class InfinityScroll {
  private container: Tag;
  private elements?: Tag[];
  private isLoading: boolean = false;
  private onLoadMore: () => Promise<void>;

  constructor(onLoadMore: () => Promise<void>, style?: any, initialElements?: Tag[]) {
    this.onLoadMore = onLoadMore;
    this.container = d.define('div', {
      overflowY: 'auto',
      height: '400px',
      ...style,
    })({
      onScroll: () => this.handleScroll(),
    });
    if (initialElements) {
      this.elements = initialElements;
    }
  }

  private async handleScroll() {
    if (this.isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = this.container.element;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.isLoading = true;
      await this.onLoadMore();
      this.isLoading = false;
    }
  }

  public getElement(): Tag {
    return this.container;
  }
}
