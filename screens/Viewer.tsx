import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./Root";
import { useRoute } from "@react-navigation/core";
import { useColors } from "../hooks/useColors";

type ViewerScreenRouteProp = RouteProp<RootStackParamList, "Viewer">;

export function Viewer() {
  const route = useRoute<ViewerScreenRouteProp>();
  const { id } = route.params;
  const colors = useColors();
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Viewer {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
