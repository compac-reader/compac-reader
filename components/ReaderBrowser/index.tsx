import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAssets } from "expo-asset";
import Base64 from "./Base64";

export type Props = {
  body: string;
  page: number;
  pageMax: number;
  pageRate: number;
  onTap: () => void;
  onPullPrev: () => void;
  onPullNext: () => void;
  onUpdatePageMax: (pageMax: number) => void;
  onChangePage: (page: number) => void;
};

export function ReaderBrowser(props: Props) {
  const webViewRef = useRef<any>();
  const [assets] = useAssets([require("./index.html")]);
  const htmlAsset = assets?.[0];

  const sendMessage = (type: string, data: any) => {
    const payload = Base64.encode(JSON.stringify({ type, data }));
    webViewRef.current?.injectJavaScript(`window.onMessage("${payload}")`);
  };

  const startRenderHTML = () => {
    const { body, pageRate } = props;
    sendMessage("load", {
      body,
      pageRate,
    });
  };

  useEffect(() => {
    const { body, pageRate } = props;
    sendMessage("load", {
      body,
      pageRate,
    });
  }, [props.body]);

  useEffect(() => {
    sendMessage("page", props.page);
  }, [props.page]);

  const onMessage = (message: string) => {
    const { type, data } = JSON.parse(message);
    switch (type) {
      case "loaded":
        startRenderHTML();
        break;
      case "changePage":
        props.onUpdatePageMax(data.maxPage);
        props.onChangePage(data.currentPage);
        break;
      case "tap":
        props.onTap();
        break;
      case "reachPageStart":
        props.onPullPrev();
        break;
      case "reachPageEnd":
        props.onPullNext();
        break;
      case "debug":
        console.log(data);
        break;
      default:
        console.error(data);
    }
  };

  return (
    <WebView
      ref={webViewRef}
      style={styles.container}
      originWhitelist={["*"]}
      overScrollMode="never"
      bounces={false}
      source={
        htmlAsset?.localUri
          ? {
              uri:
                Platform.OS === "android" ? htmlAsset.localUri : htmlAsset.uri,
            }
          : undefined
      }
      injectedJavaScript="window.initBridge();"
      startInLoadingState={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      onMessage={(event) => {
        const data = event.nativeEvent.data;
        onMessage(data);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
