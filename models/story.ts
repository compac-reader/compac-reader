import { Episode } from "./episode";

export type Story = {
  title: string;
  icon: string;
  authorName: string;
  description: string;
  lastUpdatedAt: number;
  episodes: Episode[];
};
