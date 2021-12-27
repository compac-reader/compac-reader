import { ListedEpisode } from "../lib/narouClient";

export type Story = {
  id: string;
  publisherType: "narou";
  publisherCode: string;
  title: string;
  icon?: string;
  authorName: string;
  description: string;
  lastUpdatedAt: number;
  episodes: ListedEpisode[];
};
