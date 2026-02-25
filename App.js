// App.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  Button,
  Card,
  FAB,
  Avatar,
  ProgressBar,
  Appbar,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

// -------------------- MAIN APP --------------------
export default function App() {
  const [sessions, setSessions] = useState([]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            header: (props) => <CustomAppBar {...props} />,
          }}
        >
          <Drawer.Screen name="Timer">
            {(props) => <TimerScreen {...props} sessions={sessions} setSessions={setSessions} />}
          </Drawer.Screen>

          <Drawer.Screen name="History">
            {(props) => <HistoryScreen {...props} sessions={sessions} />}
          </Drawer.Screen>

          <Drawer.Screen name="Profile">
            {(props) => <ProfileScreen {...props} sessions={sessions} />}
          </Drawer.Screen>

          <Drawer.Screen name="Motivation" component={MotivationScreen} />
          <Drawer.Screen name="Achievements" component={AchievementsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// -------------------- CUSTOM APP BAR --------------------
const CustomAppBar = ({ navigation, back, route, options }) => {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name} />
      {!back && <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />}
    </Appbar.Header>
  );
};

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
    "Knowledge is power.",
    "Today’s reading is tomorrow’s wisdom.",
  ];

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    } else clearInterval(intervalRef.current);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.timerText}>
        {Math.floor(elapsed / 60)}:{elapsed % 60 < 10 ? `0${elapsed % 60}` : elapsed % 60}
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

      {savedMessage ? <Text style={styles.savedText}>{savedMessage}</Text> : null}

      {showQuote && (
        <Card style={styles.card}>
          <Card.Content>
            <Text>{quotes[Math.floor(Math.random() * quotes.length)]}</Text>
          </Card.Content>
        </Card>
      )}

      <FAB icon="lightbulb" style={styles.fab} onPress={() => setShowQuote(!showQuote)} />
    </ScrollView>
  );
};

// -------------------- HISTORY SCREEN --------------------
const HistoryScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.historyTitle}>Session History</Text>
      <Text>Total Time Read: {hours}h {minutes}m</Text>

      {sessions.length === 0 ? (
        <Text>No sessions yet.</Text>
      ) : (
        sessions.map((session) => (
          <Card key={session.id} style={styles.card}>
            <Card.Title title={`Session: ${session.date}`} />
            <Card.Content>
              <Text>
                Duration: {Math.floor(session.duration / 60)}:
                {session.duration % 60 < 10 ? `0${session.duration % 60}` : session.duration % 60}
              </Text>
              <Text>Notes: {session.notes}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

// -------------------- PROFILE SCREEN --------------------
const ProfileScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, s) => total + s.duration, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalSessions = sessions.length;
  const dailyGoalHours = 1;
  const progress = Math.min(totalHours / dailyGoalHours, 1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Avatar.Icon size={100} icon="book" />
      <Text style={{ fontSize: 22, marginVertical: 10 }}>Reader Profile</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Total Time Read: {totalHours} hrs</Text>
          <Text>Total Sessions: {totalSessions}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Daily Goal: {dailyGoalHours} hr</Text>
          <ProgressBar progress={progress} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// -------------------- MOTIVATION SCREEN --------------------
const MotivationScreen = () => {
  const quotes = [
    "Reading is dreaming with open eyes.",
    "One page a day changes your life.",
    "Small progress is still progress.",
    "Focus builds discipline.",
    "Knowledge is power.",
    "Today’s reading is tomorrow’s wisdom.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text>{quotes[quoteIndex]}</Text>
        </Card.Content>
      </Card>
      <Button onPress={() => setQuoteIndex(Math.floor(Math.random() * quotes.length))}>
        New Quote
      </Button>
    </View>
  );
};

// -------------------- ACHIEVEMENTS SCREEN --------------------
const AchievementsScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, s) => total + s.duration, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalSessions = sessions.length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Achievements</Text>
      {totalSessions >= 1 && <Text>📖 First Session Completed!</Text>}
      {totalHours >= 1 && <Text>⏱️ 1 Hour Reading Milestone!</Text>}
      {totalHours >= 5 && <Text>🏆 5 Hours Reading Milestone!</Text>}
      {totalHours >= 10 && <Text>🥇 10 Hours Reading Milestone!</Text>}
      {totalSessions === 0 && <Text>No achievements yet. Start reading!</Text>}
    </ScrollView>
  );
};

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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