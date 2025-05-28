import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TutorialScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>How to Play UNO</Text>
        <Text style={styles.sectionTitle}>Basic Rules:</Text>
        <Text style={styles.text}>• Match cards by color or number</Text>
        <Text style={styles.text}>• Play one card at a time</Text>
        <Text style={styles.text}>• Use action cards to change the game flow</Text>
        <Text style={styles.sectionTitle}>Action Cards:</Text>
        <Text style={styles.text}>• Skip: Next player loses their turn</Text>
        <Text style={styles.text}>• Reverse: Changes direction of play</Text>
        <Text style={styles.text}>• Draw Two: Next player draws 2 cards</Text>
        <Text style={styles.text}>• Wild: Change the color</Text>
        <Text style={styles.text}>• Wild Draw Four: Change color and next player draws 4</Text>
        <Text style={styles.sectionTitle}>Winning:</Text>
        <Text style={styles.text}>• First player to play all their cards wins</Text>
        <Text style={styles.text}>• Say "UNO" when you have one card left!</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default TutorialScreen;