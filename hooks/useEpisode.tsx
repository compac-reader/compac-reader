import { useEffect, useState } from "react";
import { addBodyToEpisode, queryEpisode } from "../database";
import { fetchEpisode, ReadableEpisode } from "../lib/narouClient";

function databaseEpisodeId(storyId: string, episodeId: string) {
  if (episodeId) {
    return `${storyId}__${episodeId}`;
  } else {
    return `${storyId}__0`;
  }
}

export function useEpisode(
  storyId: string,
  episodeId: string
): ReadableEpisode | undefined {
  const [episode, setEpisode] = useState<ReadableEpisode | undefined>(
    undefined
  );
  useEffect(() => {
    (async () => {
      const episode = await queryEpisode(databaseEpisodeId(storyId, episodeId));
      const body = episode?.body;
      if (episode && body) {
        setEpisode({
          ...episode,
          publisherType: storyId.split("__")[0] as any,
          publisherCode: storyId.split("__")[1],
          body: body,
          episodeId: episodeId,
        });
        return;
      }

      const fetchedEpisode = await fetchEpisode(
        storyId.split("__")[1],
        episodeId
      );
      setEpisode(fetchedEpisode);
      await addBodyToEpisode(
        databaseEpisodeId(storyId, episodeId),
        fetchedEpisode.body
      );
    })();
  }, []);
  return episode;
}
