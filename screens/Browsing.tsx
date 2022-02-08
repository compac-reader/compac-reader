import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./Root";
import { useColors } from "../hooks/useColors";
import WebView from "react-native-webview";
import { FAB } from "react-native-elements";
import Ionicon from "react-native-vector-icons/Ionicons";
import { StackActions } from "@react-navigation/native";

type BrowsingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Browsing"
>;

export function Browsing() {
  const navigation = useNavigation<BrowsingScreenNavigationProp>();
  const colors = useColors();
  const settings = SETTINGS["narou"];
  const [publisherCode, setPublisherCode] = useState<string | undefined>();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webViewRef = useRef<WebView>(null);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <WebView
        ref={webViewRef}
        source={{ uri: settings.uri }}
        onNavigationStateChange={(e) => {
          setCanGoBack(e.canGoBack);
          setCanGoForward(e.canGoForward);
          const match = e.url.match(settings.downloadable);
          if (match) {
            setPublisherCode(match[1]);
          } else {
            setPublisherCode(undefined);
          }
        }}
      />
      <View style={{ ...styles.footerBar, backgroundColor: colors.primary }}>
        <TouchableOpacity
          disabled={!canGoBack}
          style={styles.footerButton}
          onPress={() => {
            webViewRef.current?.goBack();
          }}
        >
          <Ionicon
            name="md-arrow-back"
            size={30}
            color="#ffffff"
            style={{ opacity: canGoBack ? 1 : 0.5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canGoForward}
          style={styles.footerButton}
          onPress={() => {
            webViewRef.current?.goForward();
          }}
        >
          <Ionicon
            name="md-arrow-forward"
            size={30}
            color="#ffffff"
            style={{ opacity: canGoForward ? 1 : 0.5 }}
          />
        </TouchableOpacity>
      </View>
      <FAB
        disabled={publisherCode === undefined}
        style={styles.fab}
        color={colors.primary}
        icon={{
          type: "material",
          name: "file-download",
          color: "white",
        }}
        onPress={() => {
          if (publisherCode) {
            navigation.dispatch(
              StackActions.replace("Story", {
                id: "narou__" + publisherCode,
              })
            );
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerBar: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 80,
    flexDirection: "row",
  },
  footerButton: {
    width: 50,
    height: 50,
    padding: 10,
  },
  fab: {
    position: "absolute",
    zIndex: 20,
    right: 15,
    bottom: 15,
    shadowColor: "#470000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
});

const SETTINGS = {
  narou: {
    uri: "http://yomou.syosetu.com/",
    downloadable:
      /^(?:https?:\/\/ncode\.syosetu\.com\/(n[^\/]+)\/|https?:\/\/ncode\.syosetu\.com\/novelview\/infotop\/ncode\/(n[^\/]+))(?:\?.+)?$/,
  },
};
