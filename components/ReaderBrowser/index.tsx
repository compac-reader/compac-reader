import React from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";

export type Props = {
  body: string;
};

export function ReaderBrowser(props: Props) {
  const { localUri } = Asset.fromModule(require("./index.html"));

  return (
    <WebView
      originWhitelist={["*"]}
      source={
        Platform.OS === "android"
          ? {
              uri: localUri!.includes("ExponentAsset")
                ? localUri
                : "file:///android_asset/" + localUri!.substr(9),
            }
          : require("./index.html")
      }
    />
  );
}
