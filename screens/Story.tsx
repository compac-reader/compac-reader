import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, View, Text, RefreshControl } from "react-native";
import { EpisodeChapter } from "../components/EpisodeChapter";
import { EpisodeItem } from "../components/EpisodeItem";
import { SectionHeader } from "../components/SectionHeader";
import { StoryAbstract } from "../components/StoryAbstract";
import { StoryHeader } from "../components/StoryHeader";
import { useColors } from "../hooks/useColors";
import { RootStackParamList } from "./Root";
import { useStory } from "../hooks/useStory";
import { Button } from "react-native-elements";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { deleteStory } from "../database";

type StoryScreenRouteProp = RouteProp<RootStackParamList, "Story">;
type StoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Story"
>;

export function Story() {
  const route = useRoute<StoryScreenRouteProp>();
  const { story, isLoading, refetch, refresh } = useStory(route.params.storyId);
  const colors = useColors();
  const navigation = useNavigation<StoryScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: story?.title || "",
    });
  }, [story?.title]);

  const { showActionSheetWithOptions } = useActionSheet();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => {
            showActionSheetWithOptions(
              {
                options: ["(未実装)全てダウンロード", "削除", "キャンセル"],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 2,
              },
              (index) => {
                if (index === 0) {
                  // TODO: Download all
                } else if (index === 1) {
                  showActionSheetWithOptions(
                    {
                      options: ["削除", "キャンセル"],
                      title: "削除しても良いですか？",
                      destructiveButtonIndex: 0,
                      cancelButtonIndex: 1,
                    },
                    (index) => {
                      if (index === 0) {
                        (async () => {
                          await deleteStory(route.params.storyId);
                          navigation.goBack();
                        })();
                      }
                    }
                  );
                }
              }
            );
          }}
          type="clear"
          icon={{
            type: "simple-line-icon",
            name: "options-vertical",
            size: 18,
            color: "white",
          }}
        />
      ),
    });
  }, [navigation, route.params.storyId]);

  if (!story) {
    return <Text style={{ color: colors.text }}>Loading...</Text>;
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={story.episodes}
      initialNumToRender={10}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            refetch();
          }}
        />
      }
      ListHeaderComponent={() => (
        <View>
          <StoryHeader story={story} />
          <StoryAbstract story={story} />
          <SectionHeader title="エピソード一覧" style={styles.header} />
        </View>
      )}
      renderItem={({ item }) => {
        if (item.type === "header") {
          return <EpisodeChapter episode={item} />;
        }
        return (
          <EpisodeItem
            episode={{
              ...item,
              isRead: item.isRead,
              isDownload: item.downloadedAt !== undefined,
            }}
            bookmark={{ episodeId: story.lastReadEpisodeId || "" }}
            onPress={() => {
              navigation.navigate("Viewer", {
                storyId: route.params.storyId,
                episodeId: item.episodeId,
              });
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
