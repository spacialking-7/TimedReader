// App.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  Button,
  Card,
  FAB,
  Avatar,
  ProgressBar,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

// -------------------- MAIN APP --------------------
export default function App() {
  const [sessions, setSessions] = useState([]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Timer">
            {(props) => (
              <TimerScreen
                {...props}
                sessions={sessions}
                setSessions={setSessions}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="History">
            {(props) => <HistoryScreen {...props} sessions={sessions} />}
          </Tab.Screen>

          <Tab.Screen name="Profile">
            {(props) => <ProfileScreen {...props} sessions={sessions} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// -------------------- TIMER SCREEN --------------------
const TimerScreen = ({ sessions, setSessions }) => {
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const intervalRef = useRef(null);

  const quotes = [
    "Reading is dreaming with open eyes.",
    "One page a day changes your life.",
    "Small progress is still progress.",
    "Focus builds discipline.",
  ];

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning]);

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);

  const endSession = () => {
    setIsTimerRunning(false);
    if (elapsed === 0) return;

    const newSession = {
      id: Date.now().toString(),
      duration: elapsed,
      notes: notesInput,
      date: new Date().toLocaleDateString(),
    };

    setSessions([newSession, ...sessions]);
    setElapsed(0);
    setNotesInput("");
    setSavedMessage("Session saved!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {Math.floor(elapsed / 60)}:
        {elapsed % 60 < 10 ? `0${elapsed % 60}` : elapsed % 60}
      </Text>

      <TextInput
        placeholder="Add notes..."
        style={styles.input}
        value={notesInput}
        onChangeText={setNotesInput}
      />

      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={startTimer} style={styles.button}>
          Start
        </Button>

        <Button mode="contained" onPress={pauseTimer} style={styles.button}>
          Pause
        </Button>

        <Button mode="contained" onPress={endSession} style={styles.button}>
          Stop & Save
        </Button>
      </View>

      {savedMessage !== "" && <Text style={styles.savedText}>{savedMessage}</Text>}

      {showQuote && (
        <Card style={styles.card}>
          <Card.Content>
            <Text>{quotes[Math.floor(Math.random() * quotes.length)]}</Text>
          </Card.Content>
        </Card>
      )}

      {/* ✅ FAB for motivational quote */}
      <FAB
        icon="lightbulb"
        style={styles.fab}
        onPress={() => setShowQuote(!showQuote)}
      />
    </View>
  );
};

// -------------------- HISTORY SCREEN --------------------
const HistoryScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <View style={styles.container}>
      <Text style={styles.historyTitle}>Session History</Text>

      <Text>Total Time Read: {hours}h {minutes}m</Text>

      {sessions.length === 0 ? (
        <Text>No sessions yet.</Text>
      ) : (
        sessions.map((session) => (
          <Card key={session.id} style={styles.card}>
            <Card.Content>
              <Text>
                Duration: {Math.floor(session.duration / 60)}:
                {session.duration % 60 < 10
                  ? `0${session.duration % 60}`
                  : session.duration % 60}
              </Text>
              <Text>Notes: {session.notes}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );
};

// -------------------- PROFILE SCREEN --------------------
const ProfileScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, s) => total + s.duration, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSessions = sessions.length;
  const dailyGoalHours = 1;
  const progress = Math.min(totalHours / dailyGoalHours, 1);

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="book" />
      <Text style={{ fontSize: 22, marginVertical: 10 }}>Reader Profile</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Total Time Read: {totalHours}h {totalMinutes}m</Text>
          <Text>Total Sessions: {totalSessions}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Daily Goal: 1 hour</Text>
          <ProgressBar progress={progress} />
        </Card.Content>
      </Card>
    </View>
  );
};

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
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
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
  savedText: {
    color: "green",
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 22,
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});