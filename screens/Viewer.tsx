import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import { useRoute } from "@react-navigation/core";

type ViewerScreenRouteProp = RouteProp<RootStackParamList, "Viewer">;

export function Viewer() {
  const route = useRoute<ViewerScreenRouteProp>();
  const { id } = route.params;
  return (
    <View style={styles.container}>
      <Text>Viewer {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
