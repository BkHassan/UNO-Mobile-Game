import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Win: { winner: string };
  Game: undefined;
};

interface WinScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Win">;
  route: { params: { winner: string } };
}

const WinScreen: React.FC<WinScreenProps> = ({ route, navigation }) => {
  const { winner } = route.params;

  const handleNewGame = async () => {
    try {
      // Clear the previous game state from AsyncStorage
      await AsyncStorage.removeItem("unoGameState");
    } catch (error) {
      console.warn("Error clearing game state:", error);
    }
    // Navigate to GameScreen, which will show mode selection
    navigation.replace("Game");
  };

  return (
    <LinearGradient
      colors={["#ffecd2", "#fcb69f"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>{winner} Wins!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNewGame}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>🎮 New Game</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#2b2b2b",
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 1,
  },
  button: {
    backgroundColor: "#ff595e",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: "#ff595e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});

export default WinScreen;