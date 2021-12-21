import React from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { SectionHeader } from "../components/SectionHeader";
import { StoryList } from "../components/StoryList";
import { Story } from "../models/story";
import { useColors } from "../hooks/useColors";
import { defaultIcon } from "../assets/images";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function useStories(): Story[] {
  function makeStory(title: string): Story {
    return {
      title: title,
      icon: defaultIcon,
      description: "description",
      authorName: "author",
      lastUpdatedAt: 0,
      episodes: [],
    };
  }
  return [
    makeStory("Title 1"),
    makeStory("Title 2"),
    makeStory("Title 3"),
    makeStory("Title 4"),
    makeStory("Title 5"),
  ];
}

export function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const stories = useStories();
  const colors = useColors();

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <SectionHeader title={`登録済みの小説 (${stories.length} 件)`} />
      {stories.length > 0 ? (
        <StoryList
          stories={stories}
          isLoading={false}
          onRefresh={() => {}}
          onPressStory={(story: Story) => {
            navigation.navigate("Story", { id: story.title });
          }}
        />
      ) : (
        <Text>小説が登録されていません</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
