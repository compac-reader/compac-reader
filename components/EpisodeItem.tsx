import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import * as TimeFormatter from "../lib/TimeFormatter";
import Icon from "react-native-vector-icons/Ionicons";
import { useColors } from "../hooks/useColors";
import { Bookmark, Episode } from "../models/episode";

export type Props = {
  episode: {
    episodeId: string;
    title: string;
    publishedAt: number;
    revisedAt: number;
    isRead: boolean;
    isDownload: boolean;
  };
  bookmark: Bookmark;
  onPress: () => void;
};

export function EpisodeItem(props: Props) {
  const { episode, bookmark } = props;
  const colors = useColors();
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          ...styles.container,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        }}
      >
        {bookmark.episodeId === episode.episodeId ? (
          <View
            style={{ ...styles.bookmark, backgroundColor: colors.primary }}
          />
        ) : null}
        <Text
          style={
            episode.isRead || episode.isDownload
              ? { ...styles.title, color: colors.text }
              : { ...styles.titleGray, color: colors.textLight }
          }
          numberOfLines={1}
        >
          {episode.title}
        </Text>
        <View style={styles.info}>
          <Text style={{ ...styles.publishedAt, color: colors.textLight }}>
            公開日: {TimeFormatter.toDate(episode.publishedAt)}
          </Text>
          {(() => {
            if (!episode.revisedAt || episode.revisedAt <= episode.publishedAt)
              return null;
            return (
              <Text style={{ ...styles.revisedAt, color: colors.textLight }}>
                更新日: {TimeFormatter.toDate(episode.revisedAt)}
              </Text>
            );
          })()}
        </View>
        <View style={styles.mark}>
          <Mark episode={episode} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

type MarkProps = {
  episode: {
    isRead: boolean;
    isDownload: boolean;
  };
};
function Mark({ episode }: MarkProps) {
  const colors = useColors();
  if (episode.isRead) {
    return <Icon name="checkmark" size={14} color={colors.primary} />;
  } else if (episode.isDownload) {
    return <Icon name="book-outline" size={14} color={colors.textLight} />;
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
  },
  bookmark: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  title: {
    fontSize: 17,
    height: 17,
    lineHeight: 17,
  },
  titleGray: {
    fontSize: 17,
    height: 17,
    lineHeight: 17,
  },
  info: {
    position: "absolute",
    bottom: 10,
    left: 15,
    flexDirection: "row",
    marginTop: 10,
  },
  publishedAt: {
    fontSize: 13,
  },
  revisedAt: {
    marginLeft: 15,
    fontSize: 13,
  },
  mark: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
