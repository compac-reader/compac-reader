import React from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { SectionHeader } from "../components/SectionHeader";
import { StoryList } from "../components/StoryList";
import { Story } from "../models/story";
import { useColors } from "../hooks/useColors";
import { defaultIcon } from "../assets/images";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function useStories(): Story[] {
  function makeStory(id: string, title: string): Story {
    return {
      id: id,
      title: title,
      icon: defaultIcon,
      description: "description",
      authorName: "author",
      lastUpdatedAt: 0,
      episodes: [],
    };
  }
  return [
    makeStory(
      "n7498dq",
      "若者の黒魔法離れが深刻ですが、就職してみたら待遇いいし、社長も使い魔もかわいくて最高です！"
    ),
    makeStory(
      "n7238dp",
      "ロリ精霊達と契約したので、養う為にダンジョンに潜ります。"
    ),
    makeStory("n6829bd", "賢者の弟子を名乗る賢者"),
    makeStory("n0108dr", "生贄の后が可愛すぎてつらい"),
    makeStory("n5834cr", "Frontier World ―召喚士として活動中―"),
    makeStory("n6316bn", "転生したらスライムだった件"),
    makeStory("n4185ci", "くまクマ熊ベアー"),
  ];
}

export function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const stories = useStories();
  const colors = useColors();

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <SectionHeader title={`登録済みの小説 (${stories.length} 件)`} />
      {stories.length > 0 ? (
        <StoryList
          stories={stories}
          isLoading={false}
          onRefresh={() => {}}
          onPressStory={(story: Story) => {
            navigation.navigate("Story", { id: story.id });
          }}
        />
      ) : (
        <Text>小説が登録されていません</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
