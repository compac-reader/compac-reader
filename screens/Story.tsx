import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { defaultIcon } from "../assets/images";
import { EpisodeItem } from "../comonents/EpisodeItem";
import { SectionHeader } from "../comonents/SectionHeader";
import { StoryAbstract } from "../comonents/StoryAbstract";
import { StoryHeader } from "../comonents/StoryHeader";
import { useColors } from "../hooks/useColors";
import { Episode } from "../models/episode";
import { Story as StoryModel } from "../models/story";
import { RootStackParamList } from "./Root";

function useStory(id: string): StoryModel {
  function episode(title: string): Episode {
    return {
      episodeId: "1",
      isRead: false,
      isDownload: false,
      title: title,
      publishedAt: 0,
      revisedAt: 0,
    };
  }
  return {
    title: "Title 1",
    icon: defaultIcon,
    authorName: "Author",
    description: "description",
    lastUpdatedAt: 0,
    episodes: [
      episode("Title 1"),
      episode("Title 2"),
      episode("Title 3"),
      episode("Title 4"),
      episode("Title 5"),
      episode("Title 6"),
    ],
  };
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
              console.log(item);
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
