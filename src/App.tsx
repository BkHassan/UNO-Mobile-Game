import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GameScreen from "./components/GameScreen";
import TutorialScreen from "./components/TutorialScreen";
import TurnScreen from "./components/TurnScreen";
import WinScreen from "./components/WinScreen";
import Toast from "react-native-toast-message";

type Player = "Player 1" | "Player 2";

export type RootStackParamList = {
  Game: undefined;
  Tutorial: undefined;
  TurnScreen: {
    nextPlayer: Player;
    setCurrentPlayer: (player: Player) => void;
  };
  Win: { winner: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Game"
            screenOptions={{
              headerStyle: { backgroundColor: "#007AFF" },
              headerTintColor: "#fff",
              headerTitleStyle: { fontWeight: "bold" },
            }}
          >
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{ title: "UNO Mobile", headerShown: false }}
            />
            <Stack.Screen
              name="Tutorial"
              component={TutorialScreen}
              options={{ title: "How to Play" }}
            />
            <Stack.Screen
              name="TurnScreen"
              component={TurnScreen as React.ComponentType<any>}
              options={{ title: "Next Turn", headerShown: false }}
            />
            <Stack.Screen
              name="Win"
              component={WinScreen as React.ComponentType<any>}
              options={{ title: "Game Over", headerShown: false }}
            />
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;