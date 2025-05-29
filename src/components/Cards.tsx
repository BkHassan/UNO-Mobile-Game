import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { CardType, CardColor } from "../gameTypes";

type CardImageKey =
  | "red-0-1"
  | "red-1-1"
  | "red-1-2"
  | "red-2-1"
  | "red-2-2"
  | "red-3-1"
  | "red-3-2"
  | "red-4-1"
  | "red-4-2"
  | "red-5-1"
  | "red-5-2"
  | "red-6-1"
  | "red-6-2"
  | "red-7-1"
  | "red-7-2"
  | "red-8-1"
  | "red-8-2"
  | "red-9-1"
  | "red-9-2"
  | "red-Skip-1"
  | "red-Skip-2"
  | "red-Reverse-1"
  | "red-Reverse-2"
  | "red-Draw Two-1"
  | "red-Draw Two-2"
  | "blue-0-1"
  | "blue-1-1"
  | "blue-1-2"
  | "blue-2-1"
  | "blue-2-2"
  | "blue-3-1"
  | "blue-3-2"
  | "blue-4-1"
  | "blue-4-2"
  | "blue-5-1"
  | "blue-5-2"
  | "blue-6-1"
  | "blue-6-2"
  | "blue-7-1"
  | "blue-7-2"
  | "blue-8-1"
  | "blue-8-2"
  | "blue-9-1"
  | "blue-9-2"
  | "blue-Skip-1"
  | "blue-Skip-2"
  | "blue-Reverse-1"
  | "blue-Reverse-2"
  | "blue-Draw Two-1"
  | "blue-Draw Two-2"
  | "green-0-1"
  | "green-1-1"
  | "green-1-2"
  | "green-2-1"
  | "green-2-2"
  | "green-3-1"
  | "green-3-2"
  | "green-4-1"
  | "green-4-2"
  | "green-5-1"
  | "green-5-2"
  | "green-6-1"
  | "green-6-2"
  | "green-7-1"
  | "green-7-2"
  | "green-8-1"
  | "green-8-2"
  | "green-9-1"
  | "green-9-2"
  | "green-Skip-1"
  | "green-Skip-2"
  | "green-Reverse-1"
  | "green-Reverse-2"
  | "green-Draw Two-1"
  | "green-Draw Two-2"
  | "yellow-0"
  | "yellow-1-1"
  | "yellow-1-2"
  | "yellow-2-1"
  | "yellow-2-2"
  | "yellow-3-1"
  | "yellow-3-2"
  | "yellow-4-1"
  | "yellow-4-2"
  | "yellow-5-1"
  | "yellow-5-2"
  | "yellow-6-1"
  | "yellow-6-2"
  | "yellow-7-1"
  | "yellow-7-2"
  | "yellow-8-1"
  | "yellow-8-2"
  | "yellow-9-1"
  | "yellow-9-2"
  | "yellow-Skip-1"
  | "yellow-Skip-2"
  | "yellow-Reverse-1"
  | "yellow-Reverse-2"
  | "yellow-Draw Two-1"
  | "yellow-Draw Two-2"
  | "wild-1"
  | "wild-2"
  | "wild-3"
  | "wild-4"
  | "wild-draw4-1"
  | "wild-draw4-2"
  | "wild-draw4-3"
  | "wild-draw4-4";

const cardImages: Record<CardImageKey, any> = {
  "red-0-1": require("../../assets/cards/red-0-1.png"),
  "red-1-1": require("../../assets/cards/red-1-1.png"),
  "red-1-2": require("../../assets/cards/red-1-2.png"),
  "red-2-1": require("../../assets/cards/red-2-1.png"),
  "red-2-2": require("../../assets/cards/red-2-2.png"),
  "red-3-1": require("../../assets/cards/red-3-1.png"),
  "red-3-2": require("../../assets/cards/red-3-2.png"),
  "red-4-1": require("../../assets/cards/red-4-1.png"),
  "red-4-2": require("../../assets/cards/red-4-2.png"),
  "red-5-1": require("../../assets/cards/red-5-1.png"),
  "red-5-2": require("../../assets/cards/red-5-2.png"),
  "red-6-1": require("../../assets/cards/red-6-1.png"),
  "red-6-2": require("../../assets/cards/red-6-2.png"),
  "red-7-1": require("../../assets/cards/red-7-1.png"),
  "red-7-2": require("../../assets/cards/red-7-2.png"),
  "red-8-1": require("../../assets/cards/red-8-1.png"),
  "red-8-2": require("../../assets/cards/red-8-2.png"),
  "red-9-1": require("../../assets/cards/red-9-1.png"),
  "red-9-2": require("../../assets/cards/red-9-2.png"),
  "red-Skip-1": require("../../assets/cards/red-Skip-1.png"),
  "red-Skip-2": require("../../assets/cards/red-Skip-2.png"),
  "red-Reverse-1": require("../../assets/cards/red-Reverse-1.png"),
  "red-Reverse-2": require("../../assets/cards/red-Reverse-2.png"),
  "red-Draw Two-1": require("../../assets/cards/red-Draw Two-1.png"),
  "red-Draw Two-2": require("../../assets/cards/red-Draw Two-2.png"),
  "blue-0-1": require("../../assets/cards/blue-0-1.png"),
  "blue-1-1": require("../../assets/cards/blue-1-1.png"),
  "blue-1-2": require("../../assets/cards/blue-1-2.png"),
  "blue-2-1": require("../../assets/cards/blue-2-1.png"),
  "blue-2-2": require("../../assets/cards/blue-2-2.png"),
  "blue-3-1": require("../../assets/cards/blue-3-1.png"),
  "blue-3-2": require("../../assets/cards/blue-3-2.png"),
  "blue-4-1": require("../../assets/cards/blue-4-1.png"),
  "blue-4-2": require("../../assets/cards/blue-4-2.png"),
  "blue-5-1": require("../../assets/cards/blue-5-1.png"),
  "blue-5-2": require("../../assets/cards/blue-5-2.png"),
  "blue-6-1": require("../../assets/cards/blue-6-1.png"),
  "blue-6-2": require("../../assets/cards/blue-6-2.png"),
  "blue-7-1": require("../../assets/cards/blue-7-1.png"),
  "blue-7-2": require("../../assets/cards/blue-7-2.png"),
  "blue-8-1": require("../../assets/cards/blue-8-1.png"),
  "blue-8-2": require("../../assets/cards/blue-8-2.png"),
  "blue-9-1": require("../../assets/cards/blue-9-1.png"),
  "blue-9-2": require("../../assets/cards/blue-9-2.png"),
  "blue-Skip-1": require("../../assets/cards/blue-Skip-1.png"),
  "blue-Skip-2": require("../../assets/cards/blue-Skip-2.png"),
  "blue-Reverse-1": require("../../assets/cards/blue-Reverse-1.png"),
  "blue-Reverse-2": require("../../assets/cards/blue-Reverse-2.png"),
  "blue-Draw Two-1": require("../../assets/cards/blue-Draw Two-1.png"),
  "blue-Draw Two-2": require("../../assets/cards/blue-Draw Two-2.png"),
  "green-0-1": require("../../assets/cards/green-0-1.png"),
  "green-1-1": require("../../assets/cards/green-1-1.png"),
  "green-1-2": require("../../assets/cards/green-1-2.png"),
  "green-2-1": require("../../assets/cards/green-2-1.png"),
  "green-2-2": require("../../assets/cards/green-2-2.png"),
  "green-3-1": require("../../assets/cards/green-3-1.png"),
  "green-3-2": require("../../assets/cards/green-3-2.png"),
  "green-4-1": require("../../assets/cards/green-4-1.png"),
  "green-4-2": require("../../assets/cards/green-4-2.png"),
  "green-5-1": require("../../assets/cards/green-5-1.png"),
  "green-5-2": require("../../assets/cards/green-5-2.png"),
  "green-6-1": require("../../assets/cards/green-6-1.png"),
  "green-6-2": require("../../assets/cards/green-6-2.png"),
  "green-7-1": require("../../assets/cards/green-7-1.png"),
  "green-7-2": require("../../assets/cards/green-7-2.png"),
  "green-8-1": require("../../assets/cards/green-8-1.png"),
  "green-8-2": require("../../assets/cards/green-8-2.png"),
  "green-9-1": require("../../assets/cards/green-9-1.png"),
  "green-9-2": require("../../assets/cards/green-9-2.png"),
  "green-Skip-1": require("../../assets/cards/green-Skip-1.png"),
  "green-Skip-2": require("../../assets/cards/green-Skip-2.png"),
  "green-Reverse-1": require("../../assets/cards/green-Reverse-1.png"),
  "green-Reverse-2": require("../../assets/cards/green-Reverse-2.png"),
  "green-Draw Two-1": require("../../assets/cards/green-Draw Two-1.png"),
  "green-Draw Two-2": require("../../assets/cards/green-Draw Two-2.png"),
  "yellow-0": require("../../assets/cards/yellow-0.png"),
  "yellow-1-1": require("../../assets/cards/yellow-1-1.png"),
  "yellow-1-2": require("../../assets/cards/yellow-1-2.png"),
  "yellow-2-1": require("../../assets/cards/yellow-2-1.png"),
  "yellow-2-2": require("../../assets/cards/yellow-2-2.png"),
  "yellow-3-1": require("../../assets/cards/yellow-3-1.png"),
  "yellow-3-2": require("../../assets/cards/yellow-3-2.png"),
  "yellow-4-1": require("../../assets/cards/yellow-4-1.png"),
  "yellow-4-2": require("../../assets/cards/yellow-4-2.png"),
  "yellow-5-1": require("../../assets/cards/yellow-5-1.png"),
  "yellow-5-2": require("../../assets/cards/yellow-5-2.png"),
  "yellow-6-1": require("../../assets/cards/yellow-6-1.png"),
  "yellow-6-2": require("../../assets/cards/yellow-6-2.png"),
  "yellow-7-1": require("../../assets/cards/yellow-7-1.png"),
  "yellow-7-2": require("../../assets/cards/yellow-7-2.png"),
  "yellow-8-1": require("../../assets/cards/yellow-8-1.png"),
  "yellow-8-2": require("../../assets/cards/yellow-8-2.png"),
  "yellow-9-1": require("../../assets/cards/yellow-9-1.png"),
  "yellow-9-2": require("../../assets/cards/yellow-9-2.png"),
  "yellow-Skip-1": require("../../assets/cards/yellow-Skip-1.png"),
  "yellow-Skip-2": require("../../assets/cards/yellow-Skip-2.png"),
  "yellow-Reverse-1": require("../../assets/cards/yellow-Reverse-1.png"),
  "yellow-Reverse-2": require("../../assets/cards/yellow-Reverse-2.png"),
  "yellow-Draw Two-1": require("../../assets/cards/yellow-Draw Two-1.png"),
  "yellow-Draw Two-2": require("../../assets/cards/yellow-Draw Two-2.png"),
  "wild-1": require("../../assets/cards/wild-1.png"),
  "wild-2": require("../../assets/cards/wild-2.png"),
  "wild-3": require("../../assets/cards/wild-3.png"),
  "wild-4": require("../../assets/cards/wild-4.png"),
  "wild-draw4-1": require("../../assets/cards/wild-draw4-1.png"),
  "wild-draw4-2": require("../../assets/cards/wild-draw4-2.png"),
  "wild-draw4-3": require("../../assets/cards/wild-draw4-3.png"),
  "wild-draw4-4": require("../../assets/cards/wild-draw4-4.png"),
};

interface CardProps {
  card: CardType;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  animate?: boolean;
  order?: number;
  isBack?: boolean;
  isPlayable?: boolean;
  colorBlindMode?: boolean;
  currentColor?: CardColor;
}

const getWildCardImage = (order: number): any => {
  const key = `wild-${order}` as CardImageKey;
  return cardImages[key] || cardImages["wild-1"];
};

const Card: React.FC<CardProps> = ({
  card,
  onPress,
  style,
  disabled,
  animate = true,
  order = 1,
  isBack = false,
  isPlayable = true,
  colorBlindMode = false,
  currentColor,
}) => {
  const getCardImage = () => {
    if (isBack) {
      // Use a consistent wild card for the back that's known to exist
      return cardImages["wild-4"];
    }

    if (!card.color && (card.value === "Wild" || card.value === "WildDraw4")) {
      if (currentColor) {
        const value = card.value === "WildDraw4" ? "Draw Two" : "5";
        return (
          cardImages[`${currentColor}-${value}-${order}` as CardImageKey] ||
          getWildCardImage(order)
        );
      }
      return getWildCardImage(order);
    }

    let value: string;
    switch (card.value) {
      case "Draw2":
        value = "Draw Two";
        break;
      case "Skip":
        value = "Skip";
        break;
      case "Reverse":
        value = "Reverse";
        break;
      case "0":
        value = card.color === "yellow" ? "0" : card.value;
        break;
      default:
        value = card.value;
    }

    const key =
      card.color === "yellow" && value === "0"
        ? "yellow-0"
        : (`${card.color}-${value}-${order}` as CardImageKey);
    return cardImages[key] || getWildCardImage(order);
  };

  const imageSource = getCardImage();

  if (!imageSource) {
    return (
      <View style={[styles.container, disabled && styles.disabled, style]}>
        <Text style={styles.errorText}>
          Missing Image: {card.color || ""}-{card.value}-{order}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        disabled && styles.disabled,
        !isPlayable && styles.unplayable,
        style,
      ]}
    >
      <Animatable.View
        animation={animate ? "flipInY" : undefined}
        duration={300}
        useNativeDriver
      >
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          onError={(e) =>
            console.error(
              `Image load error: ${e.nativeEvent.error}, key: ${
                card.color || ""
              }-${card.value}-${order}`
            )
          }
        />
        {colorBlindMode && card.color && !isBack && (
          <Text style={styles.colorBlindLabel}>{card.color.toUpperCase()}</Text>
        )}
      </Animatable.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  image: {
    width: 50,
    height: 70,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  unplayable: {
    opacity: 0.7,
  },
  colorBlindLabel: {
    position: "absolute",
    top: 6, // Adjusted for smaller card
    fontSize: 10, // Slightly smaller font
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 3,
    borderRadius: 3,
  },
  errorText: {
    width: 80, // Adjusted for smaller card
    height: 120, // Adjusted
    textAlign: "center",
    color: "red",
    fontSize: 12, // Slightly smaller
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    padding: 8,
  },
});

export default Card;
