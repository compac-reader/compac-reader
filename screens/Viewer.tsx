import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import { useRoute } from "@react-navigation/core";
import { useColors } from "../hooks/useColors";
import { BareEpisode } from "../models/episode";
import { fetchEpisode } from "../lib/narouClient";
import { WebView } from "react-native-webview";

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

export function Viewer() {
  const route = useRoute<ViewerScreenRouteProp>();
  const { id } = route.params;
  const colors = useColors();
  const episode = useEpisode();
  if (episode === undefined) {
    return <Text>loading...</Text>;
  }
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Viewer {id}</Text>
      <Text>{episode?.title}</Text>
      <WebView
        style={styles.webView}
        originWhitelist={["*"]}
        source={{ html: episode.body }}
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
