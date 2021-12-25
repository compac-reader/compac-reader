import { CompacNovelViewerEvents } from './types';
import { Configuration, DEFAULT_CONFIGURATION } from './Configuration';
import { createEmitter } from './emitter';
import { convertBody } from './convertBody';
import { Page } from './Page';

export class App {
  private readonly _emitter = createEmitter<CompacNovelViewerEvents>();
  private readonly _element: HTMLDivElement;

  private _pages!: Page[];
  private _configuration: Configuration;
  private _currentBody: string = '';

  private _currentPage: number = 0;
  private _pageProgressRate: number = 0;

  private _currentTouchIdentifier: number | null = null;
  private _touchStartX: number = 0;
  private _isTouchMove: boolean = false;

  constructor(element: HTMLDivElement) {
    this._element = element;
    this._configuration = DEFAULT_CONFIGURATION;
    this.initDOM();
  }

  get listener() {
    return this._emitter.listener;
  }

  get element() {
    return this._element;
  }

  get currentPage() {
    return this._currentPage;
  }

  get maxPage() {
    return this._pages[0].maxPage || 1;
  }

  get pageProgressRate() {
    return this._pageProgressRate;
  }

  private initDOM() {
    this._element.classList.add('compac-novel-viewer');
    this._element.innerHTML = '';

    this._pages = (new Array(3)).fill(0).map((_, i) => {
      const element = document.createElement('div');
      this._element.appendChild(element);
      const page = new Page(element);
      page.pos = (['left', 'center', 'right'] as const)[i];
      return page;
    });

    this._element.addEventListener('touchstart', this.onTouchStart);
    this._element.addEventListener('touchmove', this.onTouchMove);
    this._element.addEventListener('touchend', this.onTouchEnd);
  }

  setBody(body: string, pageProgressRate: number = 0) {
    this._currentBody = body;
    this._pageProgressRate = pageProgressRate;
    this.refresh();
  }

  setConfiguration(configuration: Partial<Configuration>) {
    this._configuration = { ...this._configuration, ...configuration };
    this.refresh();
  }

  refresh() {
    const { width, height } = this._element.getBoundingClientRect();

    this._element.style.setProperty('--compacFontSize', `${this._configuration.fontSize}px`);
    this._element.style.setProperty('--compacFontFamily', this._configuration.fontFamily);
    this._element.style.setProperty('--compacBackColor', this._configuration.backColor);
    this._element.style.setProperty('--compacTextColor', this._configuration.textColor);
    this._element.style.setProperty('--compacPagePaddingX', `${this._configuration.pagePaddingX}px`);
    this._element.style.setProperty('--compacPagePaddingY', `${this._configuration.pagePaddingY}px`);
    this._element.style.setProperty('--compacPageWidth', `${width - this._configuration.pagePaddingX * 2}px`);
    this._element.style.setProperty('--compacPageHeight', `${height - this._configuration.pagePaddingX * 2}px`);

    if (this._currentBody) {
      const progressRate = this._pageProgressRate;

      const body = convertBody(this._currentBody);
      this._pages.forEach((page) => page.currentBody = body);

      const page = Math.min(Math.floor(this.maxPage * progressRate), this.maxPage - 1);
      this.goTo(page);
    }
  }

  goTo(pageNum: number, options: { skipEvent?: boolean } = {}) {
    if (pageNum < 0) pageNum = 0;
    if (pageNum >= this._pages[0].maxPage) pageNum = this._pages[0].maxPage - 1;
    if (pageNum === this._currentPage) return;

    this._currentPage = pageNum;
    this._pageProgressRate = this._currentPage / this.maxPage;

    this._pages.forEach((page) => {
      switch (page.pos) {
        case 'left':
          page.currentPage = this._currentPage + 1;
          break;
        case 'center':
          page.currentPage = this._currentPage;
          break;
        case 'right':
          page.currentPage = this._currentPage - 1;
          break;
      }

      page.updatePosition();
    });

    if (!options.skipEvent) {
      this._emitter.emit({
        type: 'changePage',
        currentPage: this.currentPage,
        maxPage: this.maxPage,
      });
    }
  }

  goNextPage() {
    const target = Math.min(this._currentPage + 1, this._pages[0].maxPage - 1);
    if (this._currentPage === target) {
      this._emitter.emit({
        type: 'reachPageEnd'
      });
      return this.cancelPageMove();
    }

    this._currentPage = target;
    this._pageProgressRate = this._currentPage / this.maxPage;

    this._pages.forEach((page) => {
      switch (page.pos) {
        case 'left': {
          page.pos = 'center';
          page.diffX = 0;
          page.currentPage = this._currentPage;
          return page.updatePosition(true);
        }
        case 'center': {
          page.pos = 'right';
          page.diffX = 0;
          page.currentPage = this._currentPage - 1;
          return page.updatePosition(true);
        }
        case 'right': {
          page.pos = 'left';
          page.diffX = 0;
          page.currentPage = this._currentPage + 1;
          return page.updatePosition();
        }
      }
    });

    this._emitter.emit({
      type: 'changePage',
      currentPage: this.currentPage,
      maxPage: this.maxPage,
    });
  }

  goPrevPage() {
    const target = Math.max(this._currentPage - 1, 0);
    if (this._currentPage === target) {
      this._emitter.emit({
        type: 'reachPageStart'
      });
      return this.cancelPageMove();
    }

    this._currentPage = target;
    this._pageProgressRate = this._currentPage / this.maxPage;

    this._pages.forEach((page) => {
      switch (page.pos) {
        case 'left': {
          page.pos = 'right';
          page.diffX = 0;
          page.currentPage = this._currentPage - 1;
          return page.updatePosition();
        }
        case 'center': {
          page.pos = 'left';
          page.diffX = 0;
          page.currentPage = this._currentPage + 1;
          return page.updatePosition(true);
        }
        case 'right': {
          page.pos = 'center';
          page.diffX = 0;
          page.currentPage = this._currentPage;
          return page.updatePosition(true);
        }
      }
    });

    this._emitter.emit({
      type: 'changePage',
      currentPage: this.currentPage,
      maxPage: this.maxPage,
    });
  }

  cancelPageMove() {
    this._pages.forEach((page) => {
      page.diffX = 0;
      page.updatePosition(true);
    });
  }

  onTouchStart = (e: TouchEvent) => {
    if (this._currentTouchIdentifier !== null) return;

    const touch = e.changedTouches[0];
    this._currentTouchIdentifier = touch.identifier;
    this._touchStartX = touch.clientX;

    this._isTouchMove = false;
  };

  onTouchMove = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; ++i) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== this._currentTouchIdentifier) continue;

      this._isTouchMove = true;
      const diff = touch.clientX - this._touchStartX;
      this._pages.forEach((page) => {
        page.diffX = diff;
        page.updatePosition(false);
      });
    }
  };

  onTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; ++i) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== this._currentTouchIdentifier) continue;
      this._currentTouchIdentifier = null;

      const { width } = this._element.getBoundingClientRect();

      if (this._isTouchMove) {
        // Swipe
        const abs = Math.abs(touch.clientX - this._touchStartX);
        if (abs < width / 10) {
          this.cancelPageMove();
        } else if (touch.clientX > this._touchStartX) {
          this.goNextPage();
        } else {
          this.goPrevPage();
        }
      } else {
        // tap
        if (touch.clientX < width / 5) {
          this.goNextPage();
        } else if (touch.clientX > width * 4 / 5) {
          this.goPrevPage();
        } else {
          this._emitter.emit({
            type: 'tap'
          });
        }
      }
    }
  };
}
