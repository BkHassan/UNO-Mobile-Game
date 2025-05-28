import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

type TurnScreenProps = NativeStackScreenProps<RootStackParamList, "TurnScreen">;

const TurnScreen: React.FC<TurnScreenProps> = ({ route, navigation }) => {
  const { nextPlayer, setCurrentPlayer } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.turnScreen}
        onPress={() => {
          setCurrentPlayer(nextPlayer);
          navigation.goBack();
        }}
      >
        <Text style={styles.turnText}>Next Player: {nextPlayer}</Text>
        <Text style={styles.turnSubText}>Tap to continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  turnScreen: {
    flex: 1,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  turnText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  turnSubText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default TurnScreen;
