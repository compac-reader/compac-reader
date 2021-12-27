import { useEffect, useState } from "react";
import { insertEpisode, insertStory, queryStory } from "../database";
import { fetchStory, Story } from "../lib/narouClient";

export function useStory(id: string): Story | undefined {
  const [story, setStory] = useState<Story>();

  useEffect(() => {
    (async () => {
      const story = await queryStory(id);

      if (story && story.episodes.length > 0) {
        setStory(story as any);
        return;
      }

      const fetchedStory = await fetchStory(id.split("__")[1]);
      setStory(fetchedStory);
      await insertStory({
        ...fetchedStory,
        // TODO: check if using current date is correct, or should we use the last updated episode date?
        lastUpdatedAt: Math.floor(Date.now() / 1000),
      });
      for (const episode of fetchedStory.episodes) {
        await insertEpisode({
          ...episode,
          isRead: false,
        });
      }
    })();
  }, []);

  return story;
}
