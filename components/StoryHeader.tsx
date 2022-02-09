import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useColors } from "../hooks/useColors";
import { defaultIcon } from "../assets/images";

export type Props = {
  story: {
    title: string;
    icon?: string;
    authorName: string;
  };
};

function onPressIcon() {
  // TODO: https://github.com/rutan/compac-reader/blob/9d90e67949358ba3ecba6bbc43ab5933a94e5b83/src/view/screen/story/header.js#L50-L66
}

export function StoryHeader({ story }: Props) {
  const colors = useColors();
  return (
    <View style={{ ...styles.container, backgroundColor: Colors.background }}>
      <TouchableOpacity onPress={onPressIcon}>
        <Image
          style={styles.image}
          source={{ uri: story.icon || defaultIcon }}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={{ ...styles.title, color: colors.text }}>
          {story.title}
        </Text>
        <Text style={{ ...styles.author, color: colors.textLight }}>
          著者: {story.authorName}
        </Text>
      </View>
    </View>
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
});
