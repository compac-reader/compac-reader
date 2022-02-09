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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { isMigrating } = useMigration();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  if (isMigrating) {
    return <View />;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Story" component={Story} />
          <Stack.Screen name="Browsing" component={Browsing} />
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
