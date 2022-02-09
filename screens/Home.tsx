import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { SectionHeader } from "../components/SectionHeader";
import { StoryList } from "../components/StoryList";
import { Story } from "../models/story";
import { useColors } from "../hooks/useColors";
import { queryStories } from "../database";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function useStories() {
  const [stories, setStories] = React.useState<Omit<Story, "episodes">[]>([]);
  useEffect(() => {
    queryStories().then((stories) => {
      setStories(stories);
    });
  }, []);
  return stories;
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
          onPressStory={(storyId: string) => {
            navigation.navigate("Story", { id: storyId });
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
