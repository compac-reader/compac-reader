import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useColors } from "../hooks/useColors";

export type Props = {
  title: string;
  size?: "medium" | "slim";
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader(props: Props) {
  const style = styles[props.size ?? "medium"];
  const colors = useColors();

  return (
    <View style={[style.container, props.style]}>
      <Text style={{ ...style.text, color: colors.primary }} numberOfLines={1}>
        {props.title}
      </Text>
    </View>
  );
}

const styles = {
  medium: StyleSheet.create({
    container: {
      height: 40,
    },
    text: {
      fontSize: 16,
      margin: 10,
    },
  }),
  slim: StyleSheet.create({
    container: {
      height: 30,
    },
    text: {
      fontSize: 14,
      margin: 6,
      marginLeft: 10,
      marginRight: 10,
    },
  }),
};
