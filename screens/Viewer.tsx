import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, SafeAreaView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useColors } from "../hooks/useColors";
import { BareEpisode } from "../models/episode";
import { fetchEpisode } from "../lib/narouClient";
import { ReaderBrowser } from "../components/ReaderBrowser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ViewerNavigation } from "../components/ViewerNavigation";

type ViewerScreenRouteProp = RouteProp<RootStackParamList, "Viewer">;

function useEpisode(id: string, episodeId: string): BareEpisode | undefined {
  const [episode, setEpisode] = useState<BareEpisode | undefined>(undefined);
  useEffect(() => {
    fetchEpisode(id, episodeId).then((episode) => {
      // fetchEpisode("n6829bd", "1").then((episode) => { // 普通の
      // fetchEpisode("n1108hj", "1").then((episode) => { // 挿絵付き
      setEpisode(episode);
    });
  }, []);
  return episode;
}

type Props = {
  initialPageRate?: number;
};

export function Viewer(props: Props) {
  const route = useRoute<ViewerScreenRouteProp>();
  const { id, episodeId } = route.params;
  const colors = useColors();
  const episode = useEpisode(id, episodeId);

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [pageMax, setPageMax] = useState(1);
  const [page, setPage] = useState(0);
  const [pageRate, setPageRate] = useState(0);

  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    setPageRate(props.initialPageRate || 0);
  }, [props.initialPageRate]);

  const navigation = useNavigation();

  if (episode === undefined) {
    return <Text>loading...</Text>;
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <ViewerNavigation
        title={episode.title}
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          ...styles.header,
          paddingTop: safeAreaInsets.top,
          // height: safeAreaInsets.top + 44,
          opacity: isShowMenu ? 1 : 0,
        }}
      />
      <SafeAreaView style={styles.container}>
        <ReaderBrowser
          body={episode.body}
          page={page}
          pageMax={pageMax}
          pageRate={pageRate}
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
            // TODO: updateBookmark
            // https://github.com/rutan/compac-reader/blob/9d90e67949358ba3ecba6bbc43ab5933a94e5b83/src/view/screen/reader/index.js#L110-L117
          }}
        />
      </SafeAreaView>
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
});
