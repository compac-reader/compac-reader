import { Episode } from "./episode";
import { ListedEpisode } from "../lib/narouClient"

export type Story = {
  id: string;
  title: string;
  icon: string;
  authorName: string;
  description: string;
  lastUpdatedAt: number;
  episodes: ListedEpisode[];
};
