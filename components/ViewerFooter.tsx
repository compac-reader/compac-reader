import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import Slider from '@react-native-community/slider';

type Props = {
  style?: StyleProp<ViewStyle>;
  currentPage: number;
  maxPage: number;
  onChangePage: (page: number) => void;
};

export function ViewerFooter(props: Props) {
  const {style, maxPage, currentPage, onChangePage} = props;

  const styleContainer = StyleSheet.flatten([styles.container, style || {}]);

  return (
    <View style={styleContainer}>
      <Slider
        style={styles.slider}
        value={currentPage}
        minimumValue={0}
        maximumValue={maxPage - 1}
        step={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={onChangePage}
        inverted={true}
      />
      <View
        style={styles.infoLine}
      >
        <Text style={styles.pageNumberText}>
          {currentPage + 1} / {maxPage}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#33333399",
    paddingLeft: 16,
    paddingRight: 16,
  },
  slider: {
    width: '100%'
  },
  infoLine: {
  },
  pageNumberText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
