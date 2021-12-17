import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  LayoutChangeEvent,
  useColorScheme,
} from "react-native";
import { useColors } from "../hooks/useColors";
import { Story } from "../models/story";
import { SectionHeader } from "./SectionHeader";
import { LinearGradient } from "expo-linear-gradient";

export type Props = {
  story: Story;
};
const bodyMaxHeight = 80;

export function StoryAbstract({ story }: Props) {
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();

  function onLayoutBody(e: LayoutChangeEvent) {
    // TODO: https://github.com/rutan/compac-reader/blob/9d90e67949358ba3ecba6bbc43ab5933a94e5b83/src/view/screen/story/abstract.js#L69-L77
    console.log(e);
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <SectionHeader title="あらすじ" />
      <View
        style={isOpen ? styles.bodyWithOpen : styles.bodyWithClose}
        onLayout={onLayoutBody}
      >
        <Text style={{ ...styles.bodyText, color: colors.text }}>
          {story.description}
        </Text>
        {!isOpen && (
          <LinearGradient
            style={styles.open}
            colors={
              colorScheme === "dark"
                ? ["#00000000", "#00000099", "#000000ff", "#000000ff"]
                : ["#ffffff00", "#ffffff99", "#ffffffff", "#ffffffff"]
            }
          >
            <TouchableOpacity
              style={styles.openInner}
              onPress={() => setIsOpen(true)}
            >
              <Text style={{ ...styles.openText, color: colors.primary }}>
                すべて表示
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
  bodyWithOpen: {},
  bodyWithClose: {
    maxHeight: bodyMaxHeight,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 26,
    marginLeft: 10,
    marginRight: 10,
  },
  open: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  openInner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  openText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: 16,
    textAlign: "center",
  },
});
