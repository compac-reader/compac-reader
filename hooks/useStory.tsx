import { useEffect, useState } from "react";
import { fetchStory, Story } from "../lib/narouClient";

export function useStory(id: string): Story | undefined {
  const [story, setStory] = useState<Story>();

  useEffect(() => {
    fetchStory(id).then((story) => {
      setStory(story);
    });
  }, []);

  return story;
}
