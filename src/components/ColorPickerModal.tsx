import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { CardColor } from "../gameTypes";

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: CardColor) => void;
  cardType?: "Wild" | "WildDraw4"; // Add this prop to indicate card type
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  cardType = "Wild", // Default to "Wild"
}) => {
  const colors: NonNullable<CardColor>[] = ["red", "blue", "green", "yellow"];
  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const getColorStyle = (color: CardColor) => {
    switch (color) {
      case "red":
        return { backgroundColor: "#ff4444" };
      case "blue":
        return { backgroundColor: "#007AFF" };
      case "green":
        return { backgroundColor: "#34C759" };
      case "yellow":
        return { backgroundColor: "#FFCC00" };
      default:
        return { backgroundColor: "#000000" };
    }
  };

  // Get the appropriate title and description based on card type
  const getModalContent = () => {
    if (cardType === "WildDraw4") {
      return {
        title: "Wild Draw 4",
        subtitle: "Choose a color and next player draws 4 cards",
        titleStyle: styles.wildDraw4Title,
      };
    } else {
      return {
        title: "Wild Card",
        subtitle: "Choose a color to continue",
        titleStyle: styles.wildTitle,
      };
    }
  };

  const modalContent = getModalContent();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.title, modalContent.titleStyle]}>
            {modalContent.title}
          </Text>
          <Text style={styles.subtitle}>{modalContent.subtitle}</Text>
          
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, getColorStyle(color)]}
                onPress={() => {
                  onSelectColor(color);
                  onClose();
                }}
              >
                <Text style={styles.colorText}>{color.toUpperCase()!}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  wildTitle: {
    color: "#333",
  },
  wildDraw4Title: {
    color: "#ff4444", // Red color for Wild Draw 4 to make it more prominent
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 25,
  },
  colorButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ColorPickerModal;