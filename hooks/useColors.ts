import { useColorScheme } from "react-native";

export type Colors = {
  background: string;
  text: string;
  textLight: string;
  primary: string;
  border: string;
  viewer: {
    background: string;
    text: string;
  };
};

export function useColors(): Colors {
  const scheme = useColorScheme();
  if (scheme === "dark") {
    return {
      background: "#000",
      text: "#fff",
      textLight: "#777",
      primary: "#009688",
      border: "#111",
      viewer: {
        background: "#000",
        text: "#fff",
      },
    };
  } else {
    return {
      background: "#fff",
      text: "#000",
      textLight: "#999",
      primary: "#009688",
      border: "#eee",
      viewer: {
        background: "#fffff1",
        text: "#333",
      },
    };
  }
}
