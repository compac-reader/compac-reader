import React from "react";
import { StyleSheet, View } from "react-native";
import { useColors } from "../hooks/useColors";
import { SectionHeader } from "./SectionHeader";

export type Props = {
  episode: {
    title: string;
  };
};

export function EpisodeChapter(props: Props) {
  const { episode } = props;
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <SectionHeader
        title={episode.title}
        style={{ ...styles.header, borderBottomColor: colors.border }}
        size="medium"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
  },
});
