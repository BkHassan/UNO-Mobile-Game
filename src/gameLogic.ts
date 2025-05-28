import { CardType, GameState, CardColor } from "./gameTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const COLORS: CardColor[] = ["red", "blue", "green", "yellow"];
const NUMBERS = Array.from({ length: 10 }, (_, i) => i.toString());
const ACTIONS = ["Skip", "Reverse", "Draw2"];
const WILDS = ["Wild", "WildDraw4"];

export const createDeck = (): CardType[] => {
  const deck: CardType[] = [];

  COLORS.forEach((color) => {
    deck.push({ color, value: "0", type: "number", order: 1 });
    NUMBERS.slice(1).forEach((number) => {
      deck.push({ color, value: number, type: "number", order: 1 });
      deck.push({ color, value: number, type: "number", order: 2 });
    });
    ACTIONS.forEach((action) => {
      deck.push({ color, value: action, type: "action", order: 1 });
      deck.push({ color, value: action, type: "action", order: 2 });
    });
  });
  WILDS.forEach((wild) => {
    for (let i = 1; i <= 4; i++) {
      deck.push({ color: null, value: wild, type: "wild", order: i });
    }
  });
  return deck;
};

export const shuffleDeck = (deck: CardType[]): CardType[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const isPlayableCard = (
  card: CardType,
  topCard: CardType | undefined,
  currentColor: CardColor | null
): boolean => {
  if (!topCard || !card || !currentColor) return false;
  if (card.type === "wild") return true;
  if (card.color === currentColor) return true;
  if (card.color === topCard.color) return true;
  if (card.value === topCard.value) return true;
  return false;
};

export const saveGameState = async (state: GameState) => {
  try {
    await AsyncStorage.setItem("unoGameState", JSON.stringify(state));
  } catch (error) {
    console.warn("AsyncStorage save error:", error);
  }
};

export const loadGameState = async (
  setState: (state: Partial<GameState>) => void
) => {
  try {
    const savedState = await AsyncStorage.getItem("unoGameState");
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  } catch (error) {
    console.warn("AsyncStorage load error:", error);
  }
};

export const drawCards = (
  count: number,
  deck: CardType[],
  discardPile: CardType[],
  setDeck: (deck: CardType[] | ((prev: CardType[]) => CardType[])) => void,
  setDiscardPile: (
    pile: CardType[] | ((prev: CardType[]) => CardType[])
  ) => void,
  setHand: (hand: CardType[] | ((prev: CardType[]) => CardType[])) => void,
  saveGameState: () => void
) => {
  let newDeck = [...deck];
  let newDiscardPile = [...discardPile];

  if (newDeck.length < count && newDiscardPile.length > 1) {
    const cardsToShuffle = newDiscardPile.slice(1);
    newDeck = [...newDeck, ...shuffleDeck(cardsToShuffle)];
    newDiscardPile = [newDiscardPile[0]];
    setDiscardPile(newDiscardPile);
  }

  if (newDeck.length < count) {
    Toast.show({
      type: "error",
      text1: "Empty Deck",
      text2: "No cards left to draw!",
    });
    return;
  }

  const drawnCards = newDeck.splice(0, count);
  setHand((prev) => [...prev, ...drawnCards]);
  setDeck(newDeck);
  saveGameState();
};

export const playBotTurn = (
  player2Hand: CardType[],
  discardPile: CardType[],
  currentColor: CardColor | null,
  setPlayer2Hand: (
    hand: CardType[] | ((prev: CardType[]) => CardType[])
  ) => void,
  setDiscardPile: (
    pile: CardType[] | ((prev: CardType[]) => CardType[])
  ) => void,
  setCurrentColor: (color: CardColor) => void,
  setPlayer1Hand: (
    hand: CardType[] | ((prev: CardType[]) => CardType[])
  ) => void,
  playCard: (card: CardType, index: number, isBot: boolean) => Promise<any>,
  drawCardsFunction: (
    count: number,
    deck: CardType[],
    discardPile: CardType[],
    setDeck: (deck: CardType[] | ((prev: CardType[]) => CardType[])) => void,
    setDiscardPile: (
      pile: CardType[] | ((prev: CardType[]) => CardType[])
    ) => void,
    setHand: (hand: CardType[] | ((prev: CardType[]) => CardType[])) => void,
    saveGameState: () => void
  ) => void,
  saveGameState: () => void,
  deck?: CardType[],
  setDeck?: (deck: CardType[] | ((prev: CardType[]) => CardType[])) => void
) => {
  if (!currentColor || !discardPile[0]) return;

  const playableCards = player2Hand.filter((card) =>
    isPlayableCard(card, discardPile[0], currentColor)
  );

  if (playableCards.length > 0) {
    const actionCards = playableCards.filter(
      (card) => card.type === "action" || card.type === "wild"
    );
    const cardToPlay =
      actionCards.length > 0
        ? actionCards[Math.floor(Math.random() * actionCards.length)]
        : playableCards[Math.floor(Math.random() * playableCards.length)];

    const cardIndex = player2Hand.indexOf(cardToPlay);

    if (cardToPlay.type === "wild") {
      const colorCounts = player2Hand.reduce((counts, card) => {
        if (card.color) counts[card.color] = (counts[card.color] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      const mostCommonColor =
        Object.keys(colorCounts).sort(
          (a, b) => colorCounts[b] - colorCounts[a]
        )[0] || COLORS[0];

      cardToPlay.color = mostCommonColor as CardColor;
      setCurrentColor(mostCommonColor as CardColor);

      Toast.show({
        type: "info",
        text1: "Bot Chose Color",
        text2: `Color set to ${mostCommonColor}!`,
      });
    }

    playCard(cardToPlay, cardIndex, true);
  } else {
    if (deck && setDeck) {
      drawCardsFunction(
        1,
        deck,
        discardPile,
        setDeck,
        setDiscardPile,
        setPlayer2Hand,
        saveGameState
      );
    }
  }
};

export const getRandomColor = (): CardColor => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

export const calculateHandPoints = (hand: CardType[]): number => {
  return hand.reduce((total, card) => {
    switch (card.type) {
      case "number":
        return total + parseInt(card.value);
      case "action":
        return total + 20;
      case "wild":
        return total + 50;
      default:
        return total;
    }
  }, 0);
};

export const shouldSayUno = (hand: CardType[]): boolean => {
  return hand.length === 1;
};

export const getValidColors = (): CardColor[] => {
  return [...COLORS];
};