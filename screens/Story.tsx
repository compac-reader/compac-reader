import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { defaultIcon } from "../assets/images";
import { EpisodeItem } from "../components/EpisodeItem";
import { SectionHeader } from "../components/SectionHeader";
import { StoryAbstract } from "../components/StoryAbstract";
import { StoryHeader } from "../components/StoryHeader";
import { useColors } from "../hooks/useColors";
import { fetchStory } from "../lib/narouClient";
import { Story as StoryModel } from "../models/story";
import { RootStackParamList } from "./Root";

function useStory(id: string): StoryModel | undefined {
  const [story, setStory] = useState<StoryModel>();

  useEffect(() => {
    fetchStory(id).then((story) => {
      const s: StoryModel = {
        id: story.id,
        title: story.title,
        icon: story.icon || defaultIcon,
        authorName: story.authorName,
        description: story.description,
        lastUpdatedAt: 0,
        episodes: story.episodes.map((e) => {
          return {
            episodeId: e.episodeId || e.id,
            isRead: false,
            isDownload: false,
            title: e.title,
            publishedAt: e.publishedAt || 0,
            revisedAt: e.revisedAt || 0,
          };
        }),
      };
      setStory(s);
    });
  }, []);

  return story;
}

type StoryScreenRouteProp = RouteProp<RootStackParamList, "Story">;
type StoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Story"
>;

export function Story() {
  const route = useRoute<StoryScreenRouteProp>();
  const story = useStory(route.params.id);
  const colors = useColors();
  const navigation = useNavigation<StoryScreenNavigationProp>();
  if (!story) {
    return <Text style={{ color: colors.text }}>Loading...</Text>;
  }
  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={story.episodes}
      ListHeaderComponent={() => (
        <View>
          <StoryHeader story={story} />
          <StoryAbstract story={story} />
          <SectionHeader title="エピソード一覧" style={styles.header} />
        </View>
      )}
      renderItem={({ item, index }) => {
        return (
          <EpisodeItem
            episode={item}
            bookmark={{ episodeId: "" }}
            onPress={() => {
              navigation.navigate("Viewer", { id: item.title });
            }}
          />
        );
      }}
      keyExtractor={(_, index) => {
        return index.toString();
      }}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
