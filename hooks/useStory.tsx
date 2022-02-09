import { useCallback, useEffect, useState } from "react";
import {
  insertEpisode,
  insertStory,
  queryStory,
  Story,
  Episode,
} from "../database";
import { fetchStory } from "../lib/narouClient";

export function useStory(id: string) {
  const [story, setStory] = useState<Story & { episodes: Episode[] }>();
  const [isLoading, setIsLoading] = useState(false);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    (async () => {
      const story = await queryStory(id);
      if (story && story.episodes.length > 0 && refetchCount === 0) {
        setStory(story as any);
        return;
      }
      const fetchedStory = await fetchStory(id.split("__")[1]);
      await insertStory({
        ...fetchedStory,
        // TODO: check if using current date is correct, or should we use the last updated episode date?
        lastUpdatedAt: Math.floor(Date.now() / 1000),
      });
      for (const episode of fetchedStory.episodes) {
        // O(n^2)
        const storedEpisode = story?.episodes.find((e) => episode.id === e.id);
        if (episode.type === "episode" && storedEpisode?.type === "episode") {
          await insertEpisode({
            ...episode,
            isRead: storedEpisode.isRead || false,
            downloadedAt: storedEpisode.downloadedAt,
          });
        } else {
          if (episode.type === "episode") {
            await insertEpisode({
              ...episode,
              isRead: false,
              downloadedAt: undefined,
            });
          } else {
            await insertEpisode({
              ...episode,
            });
          }
        }
      }
      const updatedStory = await queryStory(id);
      setStory(updatedStory!);
      setIsLoading(false);
    })();
  }, [refetchCount]);

  return {
    story,
    isLoading,
    refetch: () => {
      setIsLoading(true);
      setRefetchCount((x) => x + 1);
    },
    refresh: useCallback(() => {
      (async () => {
        const story = await queryStory(id);
        if (story) {
          setStory(story);
        }
      })();
    }, []),
  };
}
