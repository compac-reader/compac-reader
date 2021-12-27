import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Story } from "../models/story";
import { StoryItem } from "./StoryItem";

export type Props = {
  stories: Omit<Story, "episodes">[];
  isLoading: boolean;
  onRefresh: () => void;
  onPressStory: (storyId: string) => void;
};

export function StoryList(props: Props) {
  return (
    <FlatList
      data={props.stories}
      renderItem={({ item, index }) => {
        return (
          <StoryItem
            story={item}
            onPress={() => {
              props.onPressStory(item.id);
            }}
          />
        );
      }}
      keyExtractor={(_, index) => {
        return index.toString();
      }}
      refreshControl={
        <RefreshControl
          refreshing={props.isLoading}
          onRefresh={props.onRefresh}
        />
      }
    />
  );
}
