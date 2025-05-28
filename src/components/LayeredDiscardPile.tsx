// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Card from "./Card";
// import { CardType, CardColor } from "../gameTypes";

// interface LayeredDiscardPileProps {
//   discardPile: CardType[];
//   currentColor: CardColor | null;
//   colorBlindMode: boolean;
// }

// const LayeredDiscardPile: React.FC<LayeredDiscardPileProps> = ({
//   discardPile,
//   currentColor,
//   colorBlindMode,
// }) => {
//   // Show up to 2 cards in the stack
//   const maxCardsToShow = 2;
//   const cardsToShow = discardPile.slice(-maxCardsToShow);

//   // Calculate the offset for each card (horizontal layering from left)
//   const cardOffset = 25; // pixels between each card horizontally
//   const totalWidth = cardOffset * (cardsToShow.length - 1);

//   if (discardPile.length === 0) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.emptyPile}>
//           <Text style={styles.placeholderText}>Empty</Text>
//         </View>
//         <Text style={styles.pileText}>Discard</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={[styles.cardStack, { width: 80 + totalWidth }]}>
//         {cardsToShow.map((card, index) => {
//           // The first card (index 0) is the bottom card, last card is on top
//           const isTopCard = index === cardsToShow.length - 1;
//           const zIndex = index + 1;
//           const leftOffset = index * cardOffset;

//           // Add slight rotation for depth effect, but NO opacity changes
//           const rotation = (Math.random() - 0.5) * 4; // Random rotation between -2 and 2 degrees
//           // Remove opacity entirely - all cards should be fully opaque

//           return (
//             <View
//               key={`discard-${index}-${card.value}-${card.color}`}
//               style={[
//                 styles.cardWrapper,
//                 {
//                   left: leftOffset,
//                   zIndex: zIndex,
//                   transform: [{ rotate: `${rotation}deg` }],
//                 },
//                 // Add background color to ensure top card blocks everything underneath
//                 isTopCard && styles.topCardWrapper,
//               ]}
//               // Completely block interaction for non-top cards
//               pointerEvents={isTopCard ? "auto" : "none"}
//             >
//               <Card
//                 card={card}
//                 isBack={false}
//                 isPlayable={false}
//                 colorBlindMode={colorBlindMode}
//                 // Disable onPress for discard pile cards entirely
//                 onPress={undefined}
//                 order={card.order || 1}
//                 currentColor={currentColor}
//                 style={styles.discardCard}
//                 // Disable the card entirely to prevent TouchableOpacity effects
//                 disabled={true}
//               />
//             </View>
//           );
//         })}
//       </View>
//       <Text style={styles.pileText}>Discard</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 20, 
//     marginTop: -10,
//   },
//   cardStack: {
//     position: "relative",
//     height: 120, // Fixed height based on card height
//     alignItems: "flex-start", // Align cards to the left
//     justifyContent: "center",
//   },
//   cardWrapper: {
//     position: "absolute",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 2,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   topCardWrapper: {
//     // Ensure the top card completely covers what's underneath
//     backgroundColor: "transparent", // This creates a blocking layer
//     // Increase shadow for more pronounced top card effect
//     shadowOpacity: 0.35,
//     shadowRadius: 4,
//     elevation: 10,
//   },
//   discardCard: {
//     // Remove any existing margins that might interfere with positioning
//     margin: 0,
//   },
//   emptyPile: {
//     width: 80,
//     height: 120,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#ddd",
//     borderStyle: "dashed",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f9f9f9",
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: "#999",
//     fontStyle: "italic",
//   },
//   pileText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "600",
//   },
// });

// export default LayeredDiscardPile;
