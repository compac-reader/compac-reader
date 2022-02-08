import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, StatusBar, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAssets } from "expo-asset";
import Base64 from "./Base64";
import {LoadingCover} from './LoadingCover';
import {useColors} from "../../hooks/useColors";

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
  const webViewRef = useRef<WebView>(null);
  const [assets] = useAssets([require("./index.html")]);
  const htmlAsset = assets?.[0];

  const {viewer: viewerColor} = useColors();
  const [isLoading, setIsLoading] = useState(true);

  const sendMessage = (type: string, data: any) => {
    const payload = Base64.encode(JSON.stringify({ type, data }));
    webViewRef.current?.injectJavaScript(`window.onMessage("${payload}")`);
  };

  const sendConfiguration = () => {
    // configurable in the future :)
    sendMessage('configuration', {
      backColor: viewerColor.background,
      textColor: viewerColor.text,
      pagePaddingTop: 0 + (StatusBar.currentHeight || 0),
      pagePaddingBottom: 0,
      pagePaddingLeft: 50,
      pagePaddingRight: 50,
    });
  };

  const startRenderHTML = () => {
    const { body, pageRate } = props;

    setIsLoading(true);
    sendConfiguration();
    sendMessage("load", {
      body,
      pageRate,
    });
  };

  useEffect(() => {
    startRenderHTML();
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
        if (isLoading) setIsLoading(false);
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
    <>
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
      <LoadingCover
        style={styles.loadingCover}
        isLoading={isLoading}
      />
    </>
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
  loadingCover: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000
  }
});
