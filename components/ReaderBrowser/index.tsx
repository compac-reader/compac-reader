import React, { useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import Base64 from "./Base64";

export type Props = {
  body: string;
};

export function ReaderBrowser(props: Props) {
  const { localUri } = Asset.fromModule(require("./index.html"));
  const webViewRef = useRef<any>();

  const sendMessage = (type: string, data: any) => {
    const payload = Base64.encode(JSON.stringify({ type, data }));
    webViewRef.current?.injectJavaScript(`window.onMessage("${payload}")`);
  };

  const startRenderHTML = () => {
    const { body } = props;
    const pageRate = 0;
    sendMessage("load", {
      body,
      pageRate,
    });
  };

  const onMessage = (message: string) => {
    const { type, data } = JSON.parse(message);
    switch (type) {
      case "loaded":
        startRenderHTML();
        break;
      case "drawn":
        // this.caches.pageMax = data.pageMax;
        // this.props.onUpdatePageMax(data.pageMax);
        break;
      case "changePage":
        // this.caches.page = data.page;
        // this.props.onChangePage(data.page);
        break;
      case "tap":
        // this.props.onTap();
        break;
      case "pullPrev":
        // this.props.onPullPrev();
        break;
      case "pullNext":
        // this.props.onPullNext();
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
      injectedJavaScript="window.initBridge();"
      onMessage={(event) => {
        const data = event.nativeEvent.data;
        onMessage(data);
      }}
    />
  );
}
