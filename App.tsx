import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import { Viewer } from "./screens/Viewer";
import { Story } from "./screens/Story";
import { RootStackParamList } from "./screens/Root";
import { useColorScheme, View } from "react-native";
import { useMigration } from "./hooks/useMigration";
import { Browsing } from "./screens/Browsing";
import { useColors } from "./hooks/useColors";
import {
  ActionSheetProvider,
} from "@expo/react-native-action-sheet";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function App() {
  const { isMigrating } = useMigration();
  const colorScheme = useColorScheme();
  const colors = useColors();
  const isDark = colorScheme === "dark";
  const theme = isDark ? DarkTheme : DefaultTheme;

  if (isMigrating) {
    return <View />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? undefined : colors.primary,
          },
          headerTintColor: isDark ? undefined : "white",
        }}
      >
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Compac Reader" }}
          />
          <Stack.Screen
            name="Story"
            component={Story}
            options={{ title: "" }}
          />
          <Stack.Screen
            name="Browsing"
            component={Browsing}
            options={{ title: "小説を探す" }}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            presentation: "fullScreenModal",
            headerShown: false,
          }}
        >
          <Stack.Screen name="Viewer" component={Viewer} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default class AppContainer extends React.Component {
  render() {
    return (
      <ActionSheetProvider>
        <App />
      </ActionSheetProvider>
    );
  }
}
