import React from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { SectionHeader } from "../comonents/SectionHeader";
import { StoryList } from "../comonents/StoryList";
import { Story } from "../models/story";
import { useColors } from "../hooks/useColors";
import { defaultIcon } from "../assets/images";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function useStories(): Story[] {
  const icon = defaultIcon;
  return [
    { title: "Title 1", icon: icon, authorName: "author", lastUpdatedAt: 0 },
    { title: "Title 2", icon: icon, authorName: "author", lastUpdatedAt: 0 },
    { title: "Title 3", icon: icon, authorName: "author", lastUpdatedAt: 0 },
    { title: "Title 4", icon: icon, authorName: "author", lastUpdatedAt: 0 },
    { title: "Title 5", icon: icon, authorName: "author", lastUpdatedAt: 0 },
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
            navigation.navigate("Viewer", { id: story.title });
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
