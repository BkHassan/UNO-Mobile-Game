import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Card from "./Cards";
import ColorPickerModal from "./ColorPickerModal";
import { useGameLogic } from "../hooks/useGameLogic";
import type {
  CardType,
  CardColor,
  Player,
  PlayCardResult,
  OnBotDrawEffect,
} from "../gameTypes";
import { isPlayableCard } from "../gameLogic";

type RootStackParamList = {
  Game: undefined;
  TurnScreen: {
    nextPlayer: Player;
    setCurrentPlayer: (player: Player) => void;
  };
  Win: { winner: string };
  Tutorial: undefined;
};

interface GameScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Game">;
}

const getColorValue = (color: CardColor | null): string => {
  switch (color) {
    case "red":
      return "#ff4444";
    case "blue":
      return "#007AFF";
    case "green":
      return "#34C759";
    case "yellow":
      return "#FFCC00";
    default:
      return "#333";
  }
};

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const {
    gameState,
    startNewGame,
    playCard,
    handleDraw,
    callUno,
    handleBotTurn,
    updateState,
    setOnBotDrawEffect,
  } = useGameLogic();

  const {
    gameMode,
    deck,
    discardPile,
    player1Hand,
    player2Hand,
    currentColor,
    currentPlayer,
    colorBlindMode,
  } = gameState;

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedCard, setSelectedCard] = useState<
    | {
        card: CardType;
        index: number;
        isBot: boolean;
        cardType: "Wild" | "WildDraw4";
      }
    | undefined
  >();
  const [player1DrawEffect, setPlayer1DrawEffect] = useState<number | null>(
    null
  );
  const [player2DrawEffect, setPlayer2DrawEffect] = useState<number | null>(
    null
  );
  const player1FadeAnim = useRef(new Animated.Value(0)).current;
  const player2FadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isPlayerTurn =
    gameMode === "pass-and-play" ||
    (gameMode === "solo" && currentPlayer === "Player 1");

  const triggerEffect = (value: number, player: Player) => {
    const setEffect =
      player === "Player 1" ? setPlayer1DrawEffect : setPlayer2DrawEffect;
    const fadeAnim = player === "Player 1" ? player1FadeAnim : player2FadeAnim;

    setEffect(value);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setEffect(null));
  };

  useEffect(() => {
    setOnBotDrawEffect(() => triggerEffect);
  }, [setOnBotDrawEffect]);

  useEffect(() => {
    if (isPlayerTurn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
    return () => pulseAnim.stopAnimation();
  }, [isPlayerTurn]);

  useEffect(() => {
    if (gameMode === "solo" && currentPlayer === "Player 2") {
      handleBotTurn(onWin, onNextTurn, triggerEffect);
    }
  }, [currentPlayer, gameMode]);

  const onWin = (winner: string) => {
    navigation.navigate("Win", { winner });
  };

  const onNextTurn = (nextPlayer: Player) => {
    if (gameMode === "pass-and-play") {
      navigation.navigate("TurnScreen", {
        nextPlayer,
        setCurrentPlayer: (player: Player) =>
          updateState({ currentPlayer: player }),
      });
    }
  };

  const handleCardPlay = async (card: CardType, index: number) => {
    if (card.type === "wild") {
      const cardType = card.value === "WildDraw4" ? "WildDraw4" : "Wild";
      setSelectedCard({ card, index, isBot: false, cardType });
      setShowColorPicker(true);
      return;
    }

    const result = await playCard(card, index, false, onWin, onNextTurn);
    if (result && "drawAmount" in result && "targetPlayer" in result) {
      triggerEffect(result.drawAmount, result.targetPlayer);
    }
  };

  const handleWildCardSelection = async (color: CardColor) => {
    if (selectedCard) {
      const { card, index } = selectedCard;
      const cardWithColor = { ...card, color };
      updateState({ currentColor: color });

      const result = await playCard(
        cardWithColor,
        index,
        false,
        onWin,
        onNextTurn
      );
      if (result && "drawAmount" in result && "targetPlayer" in result) {
        triggerEffect(result.drawAmount, result.targetPlayer);
      }

      setShowColorPicker(false);
      setSelectedCard(undefined);
    }
  };

  // Only show opponent hand in Solo mode
  const renderOpponentHand = () => {
    if (gameMode !== "solo") return null;

    return (
      <View style={styles.opponentHand}>
        <View style={styles.opponentCardRow}>
          {player2Hand.map((_, index) => (
            <Card
              card={{ color: null, value: "back", type: "number", order: 1 }}
              isBack={true}
              isPlayable={false}
              colorBlindMode={colorBlindMode}
              onPress={() => {}}
              order={1}
              key={`opponent-${index}`}
            />
          ))}
        </View>
        {player2DrawEffect && (
          <Animated.Text
            style={[
              styles.drawEffect,
              { opacity: player2FadeAnim, bottom: -40 },
            ]}
          >
            ×{player2DrawEffect}
          </Animated.Text>
        )}
      </View>
    );
  };

  const renderPlayerHand = () => {
    // In Pass and Play mode, show the current player's hand
    // In Solo mode, always show Player 1's hand
    const hand =
      gameMode === "pass-and-play"
        ? currentPlayer === "Player 1"
          ? player1Hand
          : player2Hand
        : player1Hand;

    const CARDS_PER_ROW = 5;

    const rows = [];
    for (let i = 0; i < hand.length; i += CARDS_PER_ROW) {
      rows.push(hand.slice(i, i + CARDS_PER_ROW));
    }

    const reversedRows = [...rows].reverse();

    // Determine which draw effect to show based on current player
    const currentDrawEffect =
      gameMode === "pass-and-play"
        ? currentPlayer === "Player 1"
          ? player1DrawEffect
          : player2DrawEffect
        : player1DrawEffect;

    const currentFadeAnim =
      gameMode === "pass-and-play"
        ? currentPlayer === "Player 1"
          ? player1FadeAnim
          : player2FadeAnim
        : player1FadeAnim;

    // Determine UNO button logic
    const currentHandLength =
      gameMode === "pass-and-play"
        ? currentPlayer === "Player 1"
          ? player1Hand.length
          : player2Hand.length
        : player1Hand.length;

    return (
      <Animated.View
        style={[
          styles.playerHand,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isPlayerTurn ? 1 : 0.4,
          },
        ]}
      >
        {reversedRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.handRow}>
            {row.map((item, cardIndex) => {
              const originalRowIndex = rows.length - 1 - rowIndex;
              const absoluteIndex =
                originalRowIndex * CARDS_PER_ROW + cardIndex;
              return (
                <Card
                  card={item}
                  isBack={false}
                  isPlayable={
                    isPlayerTurn &&
                    isPlayableCard(item, discardPile[0], currentColor)
                  }
                  onPress={() =>
                    isPlayerTurn ? handleCardPlay(item, absoluteIndex) : null
                  }
                  colorBlindMode={colorBlindMode}
                  order={item.order || 1}
                  animate={true}
                  key={`player-${rowIndex}-${cardIndex}`}
                  style={styles.card}
                />
              );
            })}
          </View>
        ))}
        {currentDrawEffect && (
          <Animated.Text
            style={[styles.drawEffect, { opacity: currentFadeAnim, top: -40 }]}
          >
            ×{currentDrawEffect}
          </Animated.Text>
        )}
      </Animated.View>
    );
  };

  const handleDrawCard = () => {
    if (isPlayerTurn) {
      handleDraw(onNextTurn);
    }
  };

  // UNO button logic - check current player's hand length
  const shouldShowUnoButton =
    gameMode === "pass-and-play"
      ? (currentPlayer === "Player 1"
          ? player1Hand.length === 2
          : player2Hand.length === 2) && !gameState.unoCalled
      : player1Hand.length === 2 && !gameState.unoCalled;

  return (
    <SafeAreaView style={styles.container}>
      {!gameMode ? (
        <View style={styles.modeSelection}>
          <Text style={styles.title}>Choose Game Mode</Text>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => startNewGame("solo")}
          >
            <Text style={styles.buttonText}>Solo vs Bot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => startNewGame("pass-and-play")}
          >
            <Text style={styles.buttonText}>Pass and Play</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {gameMode === "solo"
                ? currentPlayer === "Player 1"
                  ? "Your Turn"
                  : "Bot's Turn"
                : `${currentPlayer}'s Turn`}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                updateState({
                  gameMode: null,
                  gameStarted: false,
                  deck: [],
                  discardPile: [],
                  player1Hand: [],
                  player2Hand: [],
                  currentColor: null,
                  currentPlayer: "Player 1",
                  unoCalled: false,
                })
              }
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {renderOpponentHand()}

          <View style={styles.pilesContainer}>
            <Text style={styles.colorIndicator}>
              Current Color:{" "}
              <Text
                style={[
                  styles.colorText,
                  { color: getColorValue(currentColor) },
                ]}
              >
                {currentColor || "None"}
              </Text>
            </Text>
            <View style={[styles.piles, styles.pilesWithSpacing]}>
              <View style={styles.drawPile}>
                <Card
                  card={{
                    color: null,
                    value: "back",
                    type: "number",
                    order: 1,
                  }}
                  isBack={true}
                  isPlayable={isPlayerTurn}
                  colorBlindMode={colorBlindMode}
                  onPress={handleDrawCard}
                  order={1}
                  animate={true}
                  style={styles.card}
                />
                <Text style={styles.pileText}>
                  Draw (<Text style={styles.boldText}>{deck.length}</Text>)
                </Text>
              </View>

              <View style={styles.discardPile}>
                {discardPile.length > 0 ? (
                  <Card
                    card={discardPile[0]}
                    isBack={false}
                    isPlayable={false}
                    colorBlindMode={colorBlindMode}
                    onPress={() => {}}
                    order={discardPile[0].order || 1}
                    currentColor={currentColor}
                  />
                ) : (
                  <Text style={styles.placeholderText}>Empty</Text>
                )}
                <Text style={styles.pileText}>Discard</Text>
              </View>
            </View>
          </View>

          {renderPlayerHand()}

          {shouldShowUnoButton && (
            <TouchableOpacity style={styles.unoButton} onPress={callUno}>
              <Text style={styles.buttonText}>UNO!</Text>
            </TouchableOpacity>
          )}

          <ColorPickerModal
            visible={showColorPicker}
            onClose={() => {
              setShowColorPicker(false);
              setSelectedCard(undefined);
            }}
            onSelectColor={handleWildCardSelection}
            cardType={selectedCard?.cardType}
          />
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  modeSelection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, color: "#333" },
  modeButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  gameBoard: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  backButton: { backgroundColor: "#ECD407", padding: 10, borderRadius: 8 },
  opponentHand: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  opponentCardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorIndicator: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  colorText: {
    fontWeight: "bold",
  },
  pilesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    paddingBottom: 200,
  },
  piles: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
  pilesWithSpacing: {
    marginTop: 10,
  },
  drawPile: { alignItems: "center" },
  discardPile: { alignItems: "center" },
  pileText: { marginTop: 5, fontSize: 16, color: "#333" },
  boldText: { fontWeight: "bold" },
  placeholderText: { fontSize: 16, color: "#999" },
  playerHand: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 10,
  },
  handRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  card: {
    marginHorizontal: 5,
  },
  unoButton: {
    backgroundColor: "#FFCC00",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 20,
    bottom: 100,
  },
  drawEffect: {
    fontSize: 32,
    fontWeight: "bold",
    color: "red",
    position: "absolute",
    alignSelf: "center",
    zIndex: 10,
  },
});

export default GameScreen;
