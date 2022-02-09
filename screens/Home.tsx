import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { SectionHeader } from "../components/SectionHeader";
import { StoryList } from "../components/StoryList";
import { Story } from "../models/story";
import { useColors } from "../hooks/useColors";
import { queryStories } from "../database";
import { FAB } from "react-native-elements";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function useStories() {
  const [stories, setStories] = React.useState<Omit<Story, "episodes">[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  useEffect(() => {
    if (shouldRefresh) {
      queryStories().then((stories) => {
        setStories(stories);
      });
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);
  return {
    stories,
    refresh: () => {
      setShouldRefresh(true);
    },
  };
}

export function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { stories, refresh } = useStories();
  const colors = useColors();

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <SectionHeader title={`登録済みの小説 (${stories.length} 件)`} />
      {stories.length > 0 ? (
        <StoryList
          stories={stories}
          isLoading={false}
          onRefresh={() => {
            refresh();
          }}
          onPressStory={(storyId: string) => {
            navigation.navigate("Story", { storyId: storyId });
          }}
        />
      ) : (
        <Text>小説が登録されていません</Text>
      )}
      <FAB
        style={styles.fab}
        color={colors.primary}
        icon={{ name: "add", color: "white" }}
        onPress={() => {
          navigation.navigate("Browsing");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
});
