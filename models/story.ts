import { BareEpisode, Episode } from "./episode";

export type EpisodeInStory = {
  id: string;
  storyId: string;
  type: string;
  episodeId?: string;
  title: string;
  publishedAt?: number;
  revisedAt?: number;
  index: number | undefined;
};

export type BareStory = {
  id: string;
  publisherType: string;
  publisherCode: string;
  title: string;
  icon: string;
  authorName: string;
  description: string;
  episodes: EpisodeInStory[];
};

export type Story = {
  id: string;
  title: string;
  icon: string;
  authorName: string;
  description: string;
  lastUpdatedAt: number;
  episodes: Episode[];
};
