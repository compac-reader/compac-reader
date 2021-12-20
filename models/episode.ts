export type Episode = {
  episodeId: string;
  isRead: boolean;
  isDownload: boolean;
  title: string;
  publishedAt: number;
  revisedAt: number;
};

export type BareEpisode = {
  id: string;
  publisherType: "narou";
  publisherCode: string;
  episodeId: string;
  title: string;
  body: string;
};

export type Bookmark = {
  episodeId: string;
};
