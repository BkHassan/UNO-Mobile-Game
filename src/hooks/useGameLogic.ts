import { useState, useEffect, useRef } from "react";
import Toast from "react-native-toast-message";
import {
  CardType,
  GameState,
  CardColor,
  Player,
  PlayCardResult,
  OnBotDrawEffect,
} from "../gameTypes";
import {
  createDeck,
  shuffleDeck,
  isPlayableCard,
  saveGameState,
  loadGameState,
} from "../gameLogic";

const COLORS: CardColor[] = ["red", "blue", "green", "yellow"];

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    gameMode: null,
    deck: [],
    discardPile: [],
    player1Hand: [],
    player2Hand: [],
    currentColor: null,
    currentPlayer: "Player 1",
    unoCalled: false,
    colorBlindMode: false,
    direction: "clockwise",
    lastAction: null,
    gameStarted: false,
    scores: { player1: 0, player2: 0 },
  });

  const [onBotDrawEffect, setOnBotDrawEffect] =
    useState<OnBotDrawEffect | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const botTurnInProgress = useRef(false);
  const botTurnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    loadGameState((state) => setGameState((prev) => ({ ...prev, ...state })));
  }, []);

  const updateState = (
    newState: Partial<GameState> | ((prev: GameState) => Partial<GameState>)
  ) => {
    setGameState((prev) => {
      const updatedState =
        typeof newState === "function"
          ? { ...prev, ...newState(prev) }
          : { ...prev, ...newState };
      setTimeout(() => saveGameState(updatedState), 0);
      return updatedState;
    });
  };

  const startNewGame = (mode: "solo" | "pass-and-play") => {
    if (botTurnTimeoutRef.current) {
      clearTimeout(botTurnTimeoutRef.current);
      botTurnTimeoutRef.current = null;
    }
    botTurnInProgress.current = false;
    setIsDrawing(false);

    let newDeck = shuffleDeck(createDeck());
    const player1Cards = newDeck.splice(0, 7);
    const player2Cards = newDeck.splice(0, 7);
    let firstCard = newDeck.splice(0, 1)[0];
    let initialColor = firstCard.color;

    if (firstCard.type === "wild") {
      initialColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      firstCard.color = initialColor;
    }

    updateState({
      gameMode: mode,
      deck: newDeck,
      player1Hand: player1Cards,
      player2Hand: player2Cards,
      discardPile: [firstCard],
      currentColor: initialColor || "red",
      currentPlayer: "Player 1",
      unoCalled: false,
      gameStarted: true,
      direction: "clockwise",
      lastAction: null,
      scores: { player1: 0, player2: 0 },
    });
  };

  const playCard = (
    card: CardType,
    index: number,
    isBot: boolean = false,
    onWin: (winner: string) => void,
    onNextTurn: (nextPlayer: Player) => void
  ): PlayCardResult => {
    const currentState = gameStateRef.current;
    const topCard = currentState.discardPile[0];

    if (!isPlayableCard(card, topCard, currentState.currentColor)) {
      if (!isBot) {
        Toast.show({
          type: "error",
          text1: "Invalid Move",
          text2: `Card must match ${currentState.currentColor} or ${
            topCard?.value || "any"
          }.`,
        });
      }
      return null;
    }

    const currentHand =
      currentState.currentPlayer === "Player 1"
        ? currentState.player1Hand
        : currentState.player2Hand;
    const opponentHand =
      currentState.currentPlayer === "Player 1"
        ? currentState.player2Hand
        : currentState.player1Hand;

    if (card.type === "wild" && !card.color) {
      return { card, index, isBot };
    }

    const newHand = [...currentHand];
    newHand.splice(index, 1);

    const discardCard = {
      ...card,
      color: card.color || currentState.currentColor,
    };

    let nextPlayer: Player =
      currentState.currentPlayer === "Player 1" ? "Player 2" : "Player 1";
    let shouldContinueTurn = false;
    let drawEffect: { drawAmount: number; targetPlayer: Player } | null = null;

    if (card.type === "action") {
      switch (card.value) {
        case "Draw2":
          const cardsToDrawDraw2 = drawCardsFromDeck(
            2,
            currentState.deck,
            currentState.discardPile
          );
          const newOpponentHandDraw2 = [
            ...opponentHand,
            ...cardsToDrawDraw2.cards,
          ];

          updateState({
            ...(currentState.currentPlayer === "Player 1"
              ? { player1Hand: newHand, player2Hand: newOpponentHandDraw2 }
              : { player2Hand: newHand, player1Hand: newOpponentHandDraw2 }),
            deck: cardsToDrawDraw2.newDeck,
            discardPile: [discardCard, ...currentState.discardPile],
            currentColor: card.color || currentState.currentColor,
            lastAction: card.value,
            currentPlayer: currentState.currentPlayer,
          });

          Toast.show({
            type: "info",
            text1: "Draw 2",
            text2: `${nextPlayer} draws 2 cards and loses their turn!`,
          });

          drawEffect = { drawAmount: 2, targetPlayer: nextPlayer };
          shouldContinueTurn = true;
          nextPlayer = currentState.currentPlayer;
          break;

        case "Skip":
        case "Reverse":
          updateState({
            ...(currentState.currentPlayer === "Player 1"
              ? { player1Hand: newHand }
              : { player2Hand: newHand }),
            discardPile: [discardCard, ...currentState.discardPile],
            currentColor: card.color || currentState.currentColor,
            lastAction: card.value,
            currentPlayer: currentState.currentPlayer,
          });

          Toast.show({
            type: "info",
            text1: card.value,
            text2: `${nextPlayer} is skipped! ${currentState.currentPlayer} plays again!`,
          });

          shouldContinueTurn = true;
          nextPlayer = currentState.currentPlayer;
          break;
      }
    } else if (card.type === "wild") {
      if (card.value === "WildDraw4") {
        const cardsToDrawWild4 = drawCardsFromDeck(
          4,
          currentState.deck,
          currentState.discardPile
        );
        const newOpponentHandWild4 = [
          ...opponentHand,
          ...cardsToDrawWild4.cards,
        ];

        updateState({
          ...(currentState.currentPlayer === "Player 1"
            ? { player1Hand: newHand, player2Hand: newOpponentHandWild4 }
            : { player2Hand: newHand, player1Hand: newOpponentHandWild4 }),
          deck: cardsToDrawWild4.newDeck,
          discardPile: [discardCard, ...currentState.discardPile],
          currentColor: card.color || currentState.currentColor,
          lastAction: card.value,
          currentPlayer: currentState.currentPlayer,
        });

        Toast.show({
          type: "info",
          text1: "Wild Draw 4",
          text2: `${nextPlayer} draws 4 cards and loses their turn!`,
        });

        drawEffect = { drawAmount: 4, targetPlayer: nextPlayer };
        shouldContinueTurn = true;
        nextPlayer = currentState.currentPlayer;
      } else {
        updateState({
          ...(currentState.currentPlayer === "Player 1"
            ? { player1Hand: newHand }
            : { player2Hand: newHand }),
          discardPile: [discardCard, ...currentState.discardPile],
          currentColor: card.color || currentState.currentColor,
          lastAction: card.value,
          currentPlayer: nextPlayer,
        });
        shouldContinueTurn = false;
      }
    } else {
      updateState({
        ...(currentState.currentPlayer === "Player 1"
          ? { player1Hand: newHand }
          : { player2Hand: newHand }),
        discardPile: [discardCard, ...currentState.discardPile],
        currentColor: card.color || currentState.currentColor,
        lastAction: card.value,
        currentPlayer: nextPlayer,
      });
      shouldContinueTurn = false;
    }

    if (newHand.length === 1 && !currentState.unoCalled) {
      setTimeout(() => {
        setGameState((currentState) => {
          if (!currentState.unoCalled) {
            const penaltyCards = drawCardsFromDeck(
              2,
              currentState.deck,
              currentState.discardPile
            );
            const currentPlayerHand =
              currentState.currentPlayer === "Player 1"
                ? currentState.player1Hand
                : currentState.player2Hand;
            const penaltyHand = [...currentPlayerHand, ...penaltyCards.cards];

            Toast.show({
              type: "error",
              text1: "UNO Penalty",
              text2: `${currentState.currentPlayer} forgot to say UNO!`,
            });

            return {
              ...currentState,
              ...(currentState.currentPlayer === "Player 1"
                ? { player1Hand: penaltyHand }
                : { player2Hand: penaltyHand }),
              deck: penaltyCards.newDeck,
              discardPile:
                penaltyCards.newDiscardPile.length > 0
                  ? penaltyCards.newDiscardPile
                  : currentState.discardPile,
            };
          }
          return currentState;
        });
      }, 2000);
    } else if (newHand.length === 0) {
      onWin(currentState.currentPlayer);
      return null;
    }

    if (isBot) {
      botTurnInProgress.current = false;
      if (
        shouldContinueTurn &&
        nextPlayer === "Player 2" &&
        currentState.gameMode === "solo"
      ) {
        setTimeout(() => {
          handleBotTurn(onWin, onNextTurn, onBotDrawEffect);
        }, 1500);
      }
    }

    if (shouldContinueTurn) {
      if (currentState.gameMode === "solo" && nextPlayer === "Player 2") {
        setTimeout(() => {
          handleBotTurn(onWin, onNextTurn, onBotDrawEffect);
        }, 1500);
      }
    } else {
      setTimeout(() => {
        onNextTurn(nextPlayer);
      }, 100);
    }

    return drawEffect;
  };

  const drawCardsFromDeck = (
    count: number,
    currentDeck: CardType[],
    currentDiscardPile: CardType[]
  ) => {
    let newDeck = [...currentDeck];
    let newDiscardPile = [...currentDiscardPile];

    if (newDeck.length < count && newDiscardPile.length > 1) {
      const cardsToShuffle = newDiscardPile.slice(1);
      newDeck = [...newDeck, ...shuffleDeck(cardsToShuffle)];
      newDiscardPile = [newDiscardPile[0]];

      Toast.show({
        type: "info",
        text1: "Deck Reshuffled",
        text2: "Discard pile shuffled into deck!",
      });
    }

    const actualDrawCount = Math.min(count, newDeck.length);
    const cardsDrawn = newDeck.splice(0, actualDrawCount);

    return {
      cards: cardsDrawn,
      newDeck,
      newDiscardPile,
    };
  };

  const handleDraw = (onNextTurn: (nextPlayer: Player) => void) => {
    if (isDrawing) {
      return;
    }

    setIsDrawing(true);

    const currentState = gameStateRef.current;
    const isValidTurn =
      currentState.gameMode === "pass-and-play" ||
      (currentState.gameMode === "solo" &&
        currentState.currentPlayer === "Player 1");

    if (!isValidTurn) {
      setIsDrawing(false);
      return;
    }

    const result = drawCardsFromDeck(
      1,
      currentState.deck,
      currentState.discardPile
    );

    if (result.cards.length === 0) {
      Toast.show({
        type: "error",
        text1: "Empty Deck",
        text2: "No cards left to draw!",
      });
      setIsDrawing(false);
      return;
    }

    const isPlayer1Turn = currentState.currentPlayer === "Player 1";
    const currentHand = isPlayer1Turn
      ? currentState.player1Hand
      : currentState.player2Hand;
    const newHand = [...currentHand, ...result.cards];
    const nextPlayer = isPlayer1Turn ? "Player 2" : "Player 1";

    updateState({
      deck: result.newDeck,
      discardPile:
        result.newDiscardPile.length > 0
          ? result.newDiscardPile
          : currentState.discardPile,
      [isPlayer1Turn ? "player1Hand" : "player2Hand"]: newHand,
      currentPlayer: nextPlayer,
      unoCalled: false,
    });

    Toast.show({
      type: "success",
      text1: "Card Drawn",
      text2: `${currentState.currentPlayer} drew a card!`,
    });

    onNextTurn(nextPlayer as Player);
    setIsDrawing(false);
  };

  const callUno = () => {
    updateState({ unoCalled: true });
    Toast.show({ type: "success", text1: "UNO!" });
  };

  const handleBotTurn = (
    onWin: (winner: string) => void,
    onNextTurn: (nextPlayer: Player) => void,
    onBotDrawEffect: OnBotDrawEffect | null
  ) => {
    if (botTurnInProgress.current) {
      return;
    }

    const currentState = gameStateRef.current;

    if (
      currentState.currentPlayer !== "Player 2" ||
      currentState.gameMode !== "solo"
    ) {
      return;
    }

    botTurnInProgress.current = true;

    if (botTurnTimeoutRef.current) {
      clearTimeout(botTurnTimeoutRef.current);
      botTurnTimeoutRef.current = null;
    }

    Toast.show({
      type: "info",
      text1: "Bot Thinking",
      position: "top",
      visibilityTime: 1500,
    });

    botTurnTimeoutRef.current = setTimeout(() => {
      const latestState = gameStateRef.current;

      if (
        latestState.currentPlayer !== "Player 2" ||
        latestState.gameMode !== "solo"
      ) {
        botTurnInProgress.current = false;
        return;
      }

      if (!latestState.currentColor || !latestState.discardPile[0]) {
        botTurnInProgress.current = false;
        return;
      }

      const playableCards = latestState.player2Hand.filter((card) =>
        isPlayableCard(
          card,
          latestState.discardPile[0],
          latestState.currentColor
        )
      );

      if (playableCards.length > 0) {
        const drawCards = playableCards.filter(
          (card) =>
            (card.type === "action" && card.value === "Draw2") ||
            (card.type === "wild" && card.value === "WildDraw4")
        );
        const skipReverseCards = playableCards.filter(
          (card) =>
            card.type === "action" &&
            (card.value === "Skip" || card.value === "Reverse")
        );
        const actionCards = playableCards.filter(
          (card) => card.type === "action" || card.type === "wild"
        );

        const cardToPlay =
          drawCards.length > 0
            ? drawCards[Math.floor(Math.random() * drawCards.length)]
            : skipReverseCards.length > 0
            ? skipReverseCards[
                Math.floor(Math.random() * skipReverseCards.length)
              ]
            : actionCards.length > 0
            ? actionCards[Math.floor(Math.random() * actionCards.length)]
            : playableCards[Math.floor(Math.random() * playableCards.length)];

        const cardIndex = latestState.player2Hand.indexOf(cardToPlay);

        if (cardToPlay.type === "wild") {
          const colorCounts = latestState.player2Hand.reduce((counts, card) => {
            if (card.color) counts[card.color] = (counts[card.color] || 0) + 1;
            return counts;
          }, {} as Record<string, number>);

          const mostCommonColor =
            Object.keys(colorCounts).sort(
              (a, b) => colorCounts[b] - colorCounts[a]
            )[0] || COLORS[0];

          cardToPlay.color = mostCommonColor as CardColor;

          Toast.show({
            type: "info",
            text1: "Bot Chose Color",
            text2: `Color set to ${mostCommonColor}!`,
          });
        }

        if (latestState.player2Hand.length === 2) {
          Toast.show({ type: "info", text1: "Bot says UNO!" });
          updateState({ unoCalled: true });

          setTimeout(() => {
            const result = playCard(
              cardToPlay,
              cardIndex,
              true,
              onWin,
              onNextTurn
            );
            if (
              result &&
              "drawAmount" in result &&
              "targetPlayer" in result &&
              onBotDrawEffect
            ) {
              onBotDrawEffect(result.drawAmount, result.targetPlayer);
            }
          }, 500);
        } else {
          const result = playCard(
            cardToPlay,
            cardIndex,
            true,
            onWin,
            onNextTurn
          );
          if (
            result &&
            "drawAmount" in result &&
            "targetPlayer" in result &&
            onBotDrawEffect
          ) {
            onBotDrawEffect(result.drawAmount, result.targetPlayer);
          }
        }
      } else {
        const result = drawCardsFromDeck(
          1,
          latestState.deck,
          latestState.discardPile
        );

        if (result.cards.length > 0) {
          Toast.show({
            type: "info",
            text1: "Bot Drew Card",
            text2: "Bot drew a card and passed turn!",
          });

          updateState({
            deck: result.newDeck,
            discardPile:
              result.newDiscardPile.length > 0
                ? result.newDiscardPile
                : latestState.discardPile,
            player2Hand: [...latestState.player2Hand, ...result.cards],
            currentPlayer: "Player 1",
            unoCalled: false,
          });

          botTurnInProgress.current = false;

          setTimeout(() => {
            onNextTurn("Player 1");
          }, 500);
        } else {
          botTurnInProgress.current = false;
          Toast.show({
            type: "error",
            text1: "No Cards",
            text2: "Bot cannot draw or play!",
          });
        }
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (botTurnTimeoutRef.current) {
        clearTimeout(botTurnTimeoutRef.current);
      }
    };
  }, []);

  const setDeck = (deck: CardType[]) => updateState({ deck });
  const setDiscardPile = (pile: CardType[]) =>
    updateState({ discardPile: pile });

  return {
    gameState,
    startNewGame,
    playCard,
    handleDraw,
    callUno,
    handleBotTurn,
    updateState,
    setDeck,
    setDiscardPile,
    setOnBotDrawEffect,
  };
};
