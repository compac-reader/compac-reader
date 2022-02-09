import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/core";
import { useColors } from "../hooks/useColors";
import { ReaderBrowser } from "../components/ReaderBrowser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ViewerNavigation } from "../components/ViewerNavigation";
import { ViewerFooter } from "../components/ViewerFooter";
import { useEpisode } from "../hooks/useEpisode";
import { readEpisode } from "../database";

type ViewerScreenRouteProp = RouteProp<RootStackParamList, "Viewer">;

function pageRate(page: number, pageMax: number) {
  if (pageMax === 0) {
    return 0;
  }
  return page / pageMax;
}

export function Viewer() {
  const route = useRoute<ViewerScreenRouteProp>();
  const { storyId, episodeId } = route.params;
  const colors = useColors();
  const episode = useEpisode(storyId, episodeId);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [pageMax, setPageMax] = useState(1);
  const [page, setPage] = useState(0);

  const safeAreaInsets = useSafeAreaInsets();

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
        onPress={() => {
          (async () => {
            await readEpisode(storyId, episodeId, pageRate(page, pageMax));
            navigation.goBack();
          })();
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
        onTap={() => {
          setIsShowMenu(!isShowMenu);
        }}
        onPullPrev={() => {}}
        onPullNext={() => {}}
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
