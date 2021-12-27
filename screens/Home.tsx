import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { SectionHeader } from "../components/SectionHeader";
import { StoryList } from "../components/StoryList";
import { Story } from "../models/story";
import { useColors } from "../hooks/useColors";
import { insertStory, queryStories } from "../database";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

function useStories() {
  const [stories, setStories] = React.useState<Omit<Story, "episodes">[]>([]);
  useEffect(() => {
    queryStories().then((stories) => {
      setStories(stories);
    });
  }, []);
  return stories;
}

export function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const stories = useStories();
  const colors = useColors();
  useEffect(() => {
    (async () => {
      // TODO: remove after implementing a feature to add a new story
      await insertStory({
        id: "narou__n6829bd",
        publisherType: "narou",
        publisherCode: "n6829bd",
        title: "賢者の弟子を名乗る賢者",
        authorName: "りゅうせんひろつぐ",
        description: `仮想空間に構築された世界の一つ。鑑(かがみ)は、その世界で九賢者という術士の最高位に座していた。
ある日、徹夜の疲れから仮想空間の中で眠ってしまう。そして目を覚ますと、そこは今までの世界とは違い……。何よりも、慣れ親しんだ渋く老練とした威厳のある姿が、幼気な少女のものになってしまっていた。
何者かと問われ、正直に名乗れば今まで培ってきた荘厳なイメージを崩しかねない状況。そこで思いついた言い訳は……。`,
        lastUpdatedAt: Math.floor(Date.now() / 1000),
      });
    })();
  }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <SectionHeader title={`登録済みの小説 (${stories.length} 件)`} />
      {stories.length > 0 ? (
        <StoryList
          stories={stories}
          isLoading={false}
          onRefresh={() => {}}
          onPressStory={(storyId: string) => {
            navigation.navigate("Story", { id: storyId });
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
