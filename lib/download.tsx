import { createContext, useContext, useState } from "react";
import { addBodyToEpisode, databaseEpisodeId, queryStory } from "../database";
import { fetchEpisode } from "./narouClient";

export async function downloadEpisode(storyId: string, episodeId: string) {
  const fetchedEpisode = await fetchEpisode(storyId.split("__")[1], episodeId);
  await addBodyToEpisode(
    databaseEpisodeId(storyId, episodeId),
    fetchedEpisode.body
  );
  return fetchedEpisode;
}

export async function downloadAllEpisode(storyId: string) {
  const story = await queryStory(storyId);
  if (!story) {
    return;
  }
  let episodeIdsToDownload: string[] = [];
  for (const episode of story.episodes) {
    if (episode.type === "episode" && episode.downloadedAt === undefined) {
      episodeIdsToDownload.push(episode.episodeId);
    }
  }
}

type ListenerEvent =
  | {
      type: "downloadStarted";
      stiryId: string;
      episodeId: string;
    }
  | {
      type: "downloadCompleted";
      storyId: string;
      episodeId: string;
      completedCount: number;
      waitingCount: number;
    };
type Listener = {
  (event: ListenerEvent): void;
};
class DownloadManager {
  listeners: Listener[];
  waiters: { storyId: string; episodeIds: string[] }[];
  constructor() {
    this.listeners = [];
    this.waiters = [];
  }

  // TODO: consume waiters and notify listeners

  downloadAll(storyId: string) {
    if (this._checkHasWaiter(storyId)) {
      return;
    }
    (async () => {
      const story = await queryStory(storyId);
      if (!story) {
        return;
      }

      let notDownloadedEpisodeIds: string[] = [];
      for (const episode of story.episodes) {
        if (episode.type === "episode" && episode.downloadedAt === undefined) {
          notDownloadedEpisodeIds.push(episode.episodeId);
        }
      }
      if (this._checkHasWaiter(storyId)) {
        this.waiters.push({ storyId, episodeIds: notDownloadedEpisodeIds });
      }
    })();
  }

  addListener(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => this._removeListener(listener);
  }

  _removeListener(listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  _checkHasWaiter(storyId: string) {
    return this.waiters.some((x) => x.storyId === storyId);
  }
}

const DownloadContext = createContext(new DownloadManager());
export const DownloadContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [manager, _] = useState(new DownloadManager());
  return (
    <DownloadContext.Provider value={manager}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloadManager = () => {
  return useContext(DownloadContext);
};
