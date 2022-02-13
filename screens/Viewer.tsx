import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import { StackActions, useNavigation, useRoute } from "@react-navigation/core";
import { useColors } from "../hooks/useColors";
import { ReaderBrowser } from "../components/ReaderBrowser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ViewerNavigation } from "../components/ViewerNavigation";
import { ViewerFooter } from "../components/ViewerFooter";
import { useEpisode } from "../hooks/useEpisode";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useViewerConfiguration } from "../hooks/useViewerConfiguration";
import {
  queryNextEpisodeId,
  queryPrevEpisodeId,
  readEpisode,
} from "../database";

type ViewerScreenRouteProp = RouteProp<RootStackParamList, "Viewer">;

function pageRate(page: number, pageMax: number) {
  if (pageMax === 0) {
    return 0;
  }
  return page / pageMax;
}

const configurationMaster = [
  {
    id: "fontSize" as const,
    title: "文字サイズ",
    options: [
      { label: "小", value: 16 },
      { label: "中", value: 20 },
      { label: "大", value: 24 },
    ],
  },
  {
    id: "paddingVertical" as const,
    title: "上下の余白サイズ",
    options: [
      { label: "なし", value: 0 },
      { label: "小", value: 15 },
      { label: "中", value: 30 },
      { label: "大", value: 60 },
    ],
  },
  {
    id: "paddingHorizontal" as const,
    title: "左右の余白サイズ",
    options: [
      { label: "なし", value: 0 },
      { label: "小", value: 25 },
      { label: "中", value: 50 },
      { label: "大", value: 75 },
    ],
  },
];

export function Viewer() {
  const route = useRoute<ViewerScreenRouteProp>();
  const { storyId, episodeId } = route.params;
  const colors = useColors();
  const episode = useEpisode(storyId, episodeId);
  const [viewerConfiguration, setViewerConfiguration] =
    useViewerConfiguration();

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [pageMax, setPageMax] = useState(1);
  const [page, setPage] = useState(0);

  const safeAreaInsets = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    (async () => {
      if (episode) {
        await readEpisode(storyId, episodeId);
      }
    })();
  }, [episode?.initialPageRate]);

  useEffect(() => {
    const id = setTimeout(() => {
      (async () => {
        await readEpisode(storyId, episodeId, pageRate(page, pageMax));
      })();
    }, 5000);
    return () => {
      clearTimeout(id);
    };
  }, [storyId, episodeId, page, pageMax]);

  const navigation = useNavigation();

  if (episode === undefined) {
    return <Text>loading...</Text>;
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <ViewerNavigation
        title={episode.title}
        onPressBack={() => {
          (async () => {
            await readEpisode(storyId, episodeId, pageRate(page, pageMax));
            navigation.goBack();
          })();
        }}
        onPressMenu={() => {
          showActionSheetWithOptions(
            {
              options: [
                ...configurationMaster.map((master) => master.title),
                "キャンセル",
              ],
              cancelButtonIndex: configurationMaster.length,
            },
            (index) => {
              if (index === undefined) return;

              const targetMaster = configurationMaster[index];
              if (!targetMaster) return;

              const { id, title, options } = targetMaster;
              const currentValue = viewerConfiguration[id];

              showActionSheetWithOptions(
                {
                  title,
                  options: [
                    ...options.map(
                      (options) =>
                        `${options.label}${
                          currentValue === options.value ? "（現在値）" : ""
                        }`
                    ),
                    "キャンセル",
                  ],
                  cancelButtonIndex: options.length,
                },
                (index) => {
                  if (index === undefined) return;

                  const targetOption = targetMaster.options[index];
                  if (!targetOption) return;
                  setViewerConfiguration({
                    ...viewerConfiguration,
                    [id]: targetOption.value,
                  });
                }
              );
            }
          );
        }}
        style={{
          ...styles.header,
          paddingTop: safeAreaInsets.top,
          height: safeAreaInsets.top + 56,
          opacity: isShowMenu ? 1 : 0,
        }}
      />
      <ViewerFooter
        style={{
          ...styles.footer,
          paddingBottom: safeAreaInsets.bottom,
          height: safeAreaInsets.bottom + 56,
          opacity: isShowMenu ? 1 : 0,
        }}
        currentPage={page}
        maxPage={pageMax}
        onChangePage={(page) => setPage(page)}
      />
      <ReaderBrowser
        body={episode.body}
        page={page}
        pageMax={pageMax}
        pageRate={episode.initialPageRate || 0}
        viewerConfiguration={viewerConfiguration}
        onTap={() => {
          setIsShowMenu(!isShowMenu);
        }}
        onPullPrev={() => {
          (async () => {
            if (episode) {
              const prevId = await queryPrevEpisodeId(storyId, episode.index);
              if (prevId) {
                navigation.dispatch(
                  StackActions.replace("Viewer", {
                    storyId: storyId,
                    episodeId: prevId,
                  })
                );
              }
            }
          })();
        }}
        onPullNext={() => {
          (async () => {
            if (episode) {
              const nextId = await queryNextEpisodeId(storyId, episode.index);
              if (nextId) {
                navigation.dispatch(
                  StackActions.replace("Viewer", {
                    storyId: storyId,
                    episodeId: nextId,
                  })
                );
              }
            }
          })();
        }}
        onUpdatePageMax={(pageMax) => {
          setPageMax(pageMax);
        }}
        onChangePage={(page) => {
          setPage(page);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    alignSelf: "stretch",
  },
  header: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    zIndex: 2,
  },
  footer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
});
