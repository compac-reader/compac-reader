import { PagePos } from './types';

export class Page {
  private readonly _element: HTMLDivElement;

  private _contentElement!: HTMLDivElement;
  private _innerElement!: HTMLDivElement;
  private _daemonElement!: HTMLDivElement;
  private _currentBody: string = '';
  private _pos: PagePos = 'center';

  private _diffX: number = 0;
  private _currentPage: number = 0;
  private _maxPage: number = 0;
  private _contentHeight: number = 1;
  private _transitionEndCallbacks: (() => void)[] = [];

  constructor(element: HTMLDivElement) {
    this._element = element;
    this.initDOM();
  }

  get element() {
    return this._element;
  }

  get currentBody() {
    return this._currentBody;
  }

  set currentBody(value: string) {
    this._currentBody = value;
    this.refresh();
  }

  get pos() {
    return this._pos;
  }

  set pos(value: PagePos) {
    this._pos = value;
  }

  get diffX() {
    return this._diffX;
  }

  set diffX(value: number) {
    this._diffX = value;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(value: number) {
    this._currentPage = value;
  }

  get maxPage() {
    return this._maxPage;
  }

  private initDOM() {
    this._element.innerHTML = '';
    this._element.classList.add('compac-novel-viewer__page');
    this._element.addEventListener('transitionend', this._onTransitionEnd);

    this._innerElement = document.createElement('div');
    this._innerElement.classList.add('compac-novel-viewer__page_inner');
    this._element.appendChild(this._innerElement);

    this._contentElement = document.createElement('div');
    this._contentElement.classList.add('compac-novel-viewer__page_content');
    this._innerElement.appendChild(this._contentElement);

    this._daemonElement = document.createElement('div');
    this._daemonElement.classList.add('compac-novel-viewer__page_daemon');
  }

  refresh() {
    // reset position
    this._contentElement.style.bottom = '0';

    this._contentElement.innerHTML = this._currentBody;
    this._contentElement.appendChild(this._daemonElement);

    const columnGap = this._contentElement.getBoundingClientRect().y - this._element.getBoundingClientRect().y;
    const { height, y } = this._daemonElement.getBoundingClientRect();
    this._contentHeight = height + columnGap;
    this._maxPage = Math.ceil(y / this._contentHeight);

    return this.updatePosition();
  }

  updatePosition(withTransition: boolean = false) {
    if (withTransition) {
      this._element.classList.add('with-transition');
    } else {
      this._element.classList.remove('with-transition');
    }

    const baseX = (() => {
      switch (this.pos) {
        case 'left':
          return '-100%';
        case 'center':
          return '0px';
        case 'right':
          return '100%';
      }
    })();

    this._element.style.left = `calc(${baseX} + ${this._diffX}px)`;
    this._contentElement.style.bottom = `${this.currentPage * this._contentHeight}px`;
    this._contentElement.style.visibility = (this.currentPage < 0 || this.currentPage >= this.maxPage) ? 'hidden' : 'visible';

    if (withTransition) {
      return new Promise<void>((resolve) => {
        this._transitionEndCallbacks.push(resolve);
      });
    } else {
      return Promise.resolve();
    }
  }

  private _onTransitionEnd = () => {
    this._transitionEndCallbacks.forEach((f) => f());
    this._transitionEndCallbacks.length = 0;
  };
}
