export type Episode = {
  episodeId: string;
  isRead: boolean;
  isDownload: boolean;
  title: string;
  publishedAt: number;
  revisedAt: number;
  index: number | undefined;
};

export type Bookmark = {
  episodeId: string;
};
