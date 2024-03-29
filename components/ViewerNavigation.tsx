import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";

type Props = {
  title: string;
  onPressBack: () => void;
  onPressMenu: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ViewerNavigation(props: Props) {
  const { title, onPressBack, onPressMenu, style } = props;

  const styleContainer = StyleSheet.flatten([styles.container, style || {}]);

  return (
    <View style={styleContainer}>
      <TouchableOpacity style={styles.button} onPress={onPressBack}>
        <Ionicon name="md-close" size={30} color="#fff" />
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPressMenu}>
        <Ionicon name="md-text" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#33333399",
    paddingLeft: 10,
    paddingRight: 10,
  },
  button: {
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 52,
  },
  titleText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
});
