import { useEffect, useState } from "react";
import { fetchEpisode, ReadableEpisode } from "../lib/narouClient";

export function useEpisode(
  id: string,
  episodeId: string
): ReadableEpisode | undefined {
  const [episode, setEpisode] = useState<ReadableEpisode | undefined>(
    undefined
  );
  useEffect(() => {
    fetchEpisode(id, episodeId).then((episode) => {
      setEpisode(episode);
    });
  }, []);
  return episode;
}
