import React, {useEffect, useRef, useState} from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
} from "react-native";
import Slider from '@react-native-community/slider';
import Ionicon from "react-native-vector-icons/Ionicons";
import {useColors} from "../../hooks/useColors";

type Props = {
  style?: StyleProp<ViewStyle>;
  isLoading: boolean;
};

export function LoadingCover({style, isLoading}: Props) {
  const fadeAnim = useRef(new Animated.Value(isLoading ? 1 : 0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const [isShow, setIsShow] = useState(isLoading);
  const {viewer: viewerColor} = useColors();

  const styleContainer = StyleSheet.flatten([styles.container, style || {}]);

  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnim, {
            useNativeDriver: true,
            toValue: 10,
            duration: 150
          }),
          Animated.timing(loadingAnim, {
            useNativeDriver: true,
            toValue: 0,
            duration: 150
          }),
          Animated.delay(50)
        ]),
      );

    animation.start();

    return () => animation.stop();
  }, []);

  useEffect(() => {
    if (isLoading) setIsShow(true);

    Animated
      .timing(fadeAnim, {
        useNativeDriver: true,
        toValue: isLoading ? 1 : 0,
        duration: 150
      })
      .start(({finished}) => {
        if (finished && !isLoading) setIsShow(false)
      });
  }, [isLoading])

  if (!isShow) return null;

  return (
    <Animated.View
      style={{
        ...styleContainer,
        backgroundColor: viewerColor.background,
        opacity: fadeAnim,
      }}
    >
      <Animated.View
        style={{
          transform: [
            {translateY: loadingAnim},
          ]
        }}
      >
        <Ionicon
          name="hourglass-outline"
          size={30}
          color={viewerColor.text}
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
});
