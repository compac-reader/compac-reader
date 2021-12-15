import { useColorScheme } from "react-native";

export type Colors = {
  background: string;
  text: string;
  textLight: string;
};

export function useColors(): Colors {
  const scheme = useColorScheme();
  if (scheme === "dark") {
    return {
      background: "#000",
      text: "#fff",
      textLight: "#777",
    };
  } else {
    return {
      background: "#fff",
      text: "#000",
      textLight: "#999",
    };
  }
}
