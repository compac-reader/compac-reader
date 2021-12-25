export type PagePos = 'left' | 'center' | 'right';

export type CompacNovelViewerEvents =
  | CompacNovelViewerInitEvent
  | CompacNovelViewerTapEvent
  | CompacNovelViewerChangePageEvent
  | CompacNovelViewerReachPageStartEvent
  | CompacNovelViewerReachPageEndEvent
  ;

export interface CompacNovelViewerInitEvent {
  type: 'init';
}

export interface CompacNovelViewerTapEvent {
  type: 'tap';
}

export interface CompacNovelViewerChangePageEvent {
  type: 'changePage';
  currentPage: number;
  maxPage: number;
}

export interface CompacNovelViewerReachPageStartEvent {
  type: 'reachPageStart';
}

export interface CompacNovelViewerReachPageEndEvent {
  type: 'reachPageEnd';
}
