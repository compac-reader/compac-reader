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
            style={{
              ...styles.bookmark,
              backgroundColor: colors.primary,
            }}
          />
        ) : (
          <View style={{ ...styles.bookmark }} />
        )}

        <View style={styles.information}>
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
              if (
                !episode.revisedAt ||
                episode.revisedAt <= episode.publishedAt
              )
                return null;
              return (
                <Text style={{ ...styles.revisedAt, color: colors.textLight }}>
                  更新日: {TimeFormatter.toDate(episode.revisedAt)}
                </Text>
              );
            })()}
          </View>
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
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  bookmark: {
    width: 5,
    height: "100%",
  },
  information: {
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
  },
  titleGray: {
    fontSize: 17,
  },
  info: {
    marginTop: 4,
    flexDirection: "row",
  },
  publishedAt: {
    fontSize: 13,
  },
  revisedAt: {
    marginLeft: 15,
    fontSize: 13,
  },
  mark: {
    marginHorizontal: 10,
    justifyContent: "center",
  },
});
