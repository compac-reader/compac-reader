export type RootStackParamList = {
  Home: undefined;
  Story: { storyId: string };
  Viewer: { storyId: string; episodeId: string };
  Browsing: undefined;
};
