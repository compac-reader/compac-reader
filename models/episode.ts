export type Episode = {
  episodeId: string;
  isRead: boolean;
  isDownload: boolean;
  title: string;
  publishedAt: number;
  revisedAt: number;
};

export type Bookmark = {
  episodeId: string;
};
