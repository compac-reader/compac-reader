import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import { useRoute } from "@react-navigation/core";
import { useColors } from "../hooks/useColors";
import { BareEpisode } from "../models/episode";
import { fetchEpisode } from "../lib/narouClient";
import { ReaderBrowser } from "../components/ReaderBrowser";

type ViewerScreenRouteProp = RouteProp<RootStackParamList, "Viewer">;

function useEpisode(): BareEpisode | undefined {
  const [episode, setEpisode] = useState<BareEpisode | undefined>(undefined);
  useEffect(() => {
    fetchEpisode("n6829bd", "1").then((episode) => {
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
  const { id } = route.params;
  const colors = useColors();
  const episode = useEpisode();

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [pageMax, setPageMax] = useState(1);
  const [page, setPage] = useState(0);
  const [pageRate, setPageRate] = useState(0);

  useEffect(() => {
    setPageRate(props.initialPageRate || 0);
  }, [props.initialPageRate]);

  if (episode === undefined) {
    return <Text>loading...</Text>;
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Viewer {id}</Text>
      <Text style={{ color: colors.text }}>{episode?.title}</Text>
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
});
