export type CardColor = "red" | "blue" | "green" | "yellow" | null;

export interface CardType {
  color: CardColor;
  value: string;
  type: "number" | "action" | "wild";
  order?: number;
}

export interface GameState {
  gameMode: "solo" | "pass-and-play" | null;
  deck: CardType[];
  discardPile: CardType[];
  player1Hand: CardType[];
  player2Hand: CardType[];
  currentColor: CardColor;
  currentPlayer: "Player 1" | "Player 2";
  unoCalled: boolean;
  colorBlindMode: boolean;
  direction: "clockwise" | "counterclockwise";
  lastAction: string | null;
  gameStarted: boolean;
  scores: {
    player1: number;
    player2: number;
  };
}

export type Player = "Player 1" | "Player 2";

export type PlayCardResult =
  | { card: CardType; index: number; isBot: boolean }
  | { drawAmount: number; targetPlayer: Player }
  | null;

export type OnBotDrawEffect = (drawAmount: number, targetPlayer: Player) => void;