import React from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Story } from "../models/story";
import * as TimeFormatter from "../lib/TimeFormatter";
import { useColors } from "../hooks/useColors";
import { defaultIcon } from "../assets/images";

export type Props = {
  story: Omit<Story, "episodes">;
  onPress: () => void;
};

export function StoryItem(props: Props) {
  const story = props.story;
  const colors = useColors();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: story.icon || defaultIcon }}
        />
        <View style={styles.info}>
          <Text
            style={{ ...styles.title, color: colors.text }}
            numberOfLines={2}
          >
            {story.title}
          </Text>
          <Text
            style={{ ...styles.author, color: colors.textLight }}
            numberOfLines={1}
          >
            著者: {story.authorName}
          </Text>
          <Text
            style={{ ...styles.updated, color: colors.textLight }}
            numberOfLines={1}
          >
            更新日: {TimeFormatter.toDate(story.lastUpdatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  info: {
    flex: 1,
    marginLeft: 5,
  },
  title: {
    fontSize: 17,
    lineHeight: 25,
  },
  author: {
    fontSize: 13,
  },
  updated: {
    fontSize: 13,
  },
});
