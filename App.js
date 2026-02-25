// App.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Provider as PaperProvider, Appbar, Text, Button, FAB, Card } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

// --- Timer Screen ---
const TimerScreen = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);
    intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    clearInterval(intervalRef.current);
    setElapsed(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{Math.floor(elapsed / 60)}:{elapsed % 60 < 10 ? `0${elapsed % 60}` : elapsed % 60}</Text>
      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={startTimer} style={styles.button}>Start</Button>
        <Button mode="contained" onPress={pauseTimer} style={styles.button}>Pause</Button>
        <Button mode="contained" onPress={resetTimer} style={styles.button}>Reset</Button>
      </View>
    </View>
  );
};

// --- History / Stats Screen ---
const HistoryScreen = () => {
  // Placeholder state
  const [sessions, setSessions] = useState([]);
  return (
    <View style={styles.container}>
      <Text>Session History</Text>
      {sessions.length === 0 ? (
        <Text>No sessions yet.</Text>
      ) : (
        sessions.map((session) => (
          <Card key={session.id} style={styles.card}>
            <Card.Title title={`Session: ${session.date}`} />
            <Card.Content>
              <Text>Duration: {session.duration} min</Text>
              <Text>Notes: {session.notes}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );
};

// --- Motivation / Book Suggestions Screen ---
const MotivationScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Motivational Quotes & Book Suggestions</Text>
      {/* Placeholder for API content */}
      <Card style={styles.card}>
        <Card.Title title="Quote Example" />
        <Card.Content>
          <Text>"Reading is dreaming with open eyes."</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

// --- Main App ---
export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Timer" component={TimerScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Motivation" component={MotivationScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  timerText: {
    fontSize: 48,
    marginVertical: 32,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    width: "100%",
    marginVertical: 8,
  },
});