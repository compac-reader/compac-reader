import { useEffect, useState } from "react";
import {
  addBodyToEpisode,
  queryEpisode,
  databaseEpisodeId,
  queryStory,
} from "../database";
import { fetchEpisode, ReadableEpisode } from "../lib/narouClient";

export async function downloadEpisode(storyId: string, episodeId: string) {
  const fetchedEpisode = await fetchEpisode(storyId.split("__")[1], episodeId);
  await addBodyToEpisode(
    databaseEpisodeId(storyId, episodeId),
    fetchedEpisode.body
  );
  return fetchedEpisode;
}

export function useEpisode(
  storyId: string,
  episodeId: string
): (ReadableEpisode & { index: number; initialPageRate?: number }) | undefined {
  const [episode, setEpisode] = useState<
    (ReadableEpisode & { index: number; initialPageRate?: number }) | undefined
  >(undefined);
  useEffect(() => {
    (async () => {
      const story = await queryStory(storyId);
      const episode = await queryEpisode(databaseEpisodeId(storyId, episodeId));
      const body = episode?.body;
      if (episode && body) {
        setEpisode({
          ...episode,
          publisherType: storyId.split("__")[0] as any,
          publisherCode: storyId.split("__")[1],
          body: body,
          episodeId: episodeId,
          initialPageRate:
            story?.lastReadEpisodeId === episodeId
              ? story.lastReadPageRate
              : undefined,
        });
        return;
      }

      const downloadedEpisode = await downloadEpisode(storyId, episodeId);
      setEpisode({ ...downloadedEpisode, index: episode!.index });
    })();
  }, [storyId, episodeId]);
  return episode;
}
