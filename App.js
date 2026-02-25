// App.js
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, ScrollView, Animated, Pressable } from "react-native";
import {
  Provider as PaperProvider,
  Text,
  Card,
  FAB,
  Avatar,
  ProgressBar,
  Appbar,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// -------------------- COLOR PALETTE --------------------
const colors = {
  primary: "#1E88E5",
  secondary: "#FFC107",
  background: "#F5F5F5",
  card: "#FFFFFF",
  textPrimary: "#212121",
  textSecondary: "#616161",
  buttonText: "#FFFFFF",
};

// -------------------- NAVIGATORS --------------------
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// -------------------- MAIN APP --------------------
export default function App() {
  const [sessions, setSessions] = useState([]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator screenOptions={{ header: (props) => <CustomAppBar {...props} /> }}>
          <Drawer.Screen name="Home">
            {() => (
              <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: colors.primary } }}>
                <Tab.Screen name="Timer">
                  {(props) => <TimerScreen {...props} sessions={sessions} setSessions={setSessions} />}
                </Tab.Screen>
                <Tab.Screen name="History">
                  {(props) => <HistoryScreen {...props} sessions={sessions} />}
                </Tab.Screen>
                <Tab.Screen name="Profile">
                  {(props) => <ProfileScreen {...props} sessions={sessions} />}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Drawer.Screen>
          <Drawer.Screen name="Motivation" component={MotivationScreen} />
          <Drawer.Screen name="Achievements">
            {() => <AchievementsScreen sessions={sessions} />}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// -------------------- CUSTOM APP BAR --------------------
const CustomAppBar = ({ navigation, back, route }) => (
  <Appbar.Header style={{ backgroundColor: colors.primary }}>
    {back && <Appbar.BackAction onPress={navigation.goBack} color={colors.buttonText} />}
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.buttonText, fontSize: 20, fontWeight: "700" }}>BOOKED TIME</Text>
      <Text style={{ color: colors.buttonText, fontSize: 12 }}>Track your reading sessions</Text>
    </View>
    {!back && <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color={colors.buttonText} />}
  </Appbar.Header>
);

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

  // --- FAB animation ---
  const fabAnim = useRef(new Animated.Value(0)).current;
  const animateFAB = () => {
    Animated.sequence([
      Animated.timing(fabAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
      Animated.timing(fabAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (isTimerRunning) intervalRef.current = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    else clearInterval(intervalRef.current);
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

  const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.timerText}>{minutes}:{seconds}</Text>

      <TextInput
        placeholder="Add notes..."
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        value={notesInput}
        onChangeText={setNotesInput}
      />

      <View style={styles.buttonRow}>
        {["Start", "Pause", "Stop & Save"].map((label) => {
          const bgColor = label === "Pause" ? colors.secondary : colors.primary;
          const action = label === "Start" ? startTimer : label === "Pause" ? pauseTimer : endSession;
          return (
            <Pressable key={label} onPress={action} style={({ pressed }) => [
              styles.button,
              { backgroundColor: bgColor, transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}>
              <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {savedMessage ? <Text style={styles.savedText}>{savedMessage}</Text> : null}

      {showQuote && (
        <Animated.View style={{ opacity: fabAnim.interpolate({ inputRange: [-20,0], outputRange: [0,1] }) }}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={{ color: colors.textPrimary, fontStyle: "italic", textAlign: "center" }}>
                {quotes[Math.floor(Math.random() * quotes.length)]}
              </Text>
            </Card.Content>
          </Card>
        </Animated.View>
      )}

      <Animated.View style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        transform: [{ translateY: fabAnim }],
      }}>
        <FAB
          icon="lightbulb"
          style={{ backgroundColor: colors.secondary }}
          onPress={() => { setShowQuote(!showQuote); animateFAB(); }}
        />
      </Animated.View>
    </ScrollView>
  );
};

// -------------------- HISTORY SCREEN --------------------
const HistoryScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, s) => total + s.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.historyTitle}>Session History</Text>
      <Text>Total Time Read: {hours}h {minutes}m</Text>

      {sessions.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>No sessions yet.</Text>
      ) : (
        sessions.map((session) => {
          const fadeAnim = new Animated.Value(0);
          useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start(); }, []);
          return (
            <Animated.View key={session.id} style={{ opacity: fadeAnim, width: "100%" }}>
              <Card style={styles.card}>
                <Card.Title title={`Session: ${session.date}`} titleStyle={styles.cardTitle} />
                <Card.Content>
                  <Text style={styles.cardContent}>
                    Duration: {Math.floor(session.duration / 60)}:
                    {(session.duration % 60).toString().padStart(2, "0")}
                  </Text>
                  <Text style={styles.notesText}>Notes: {session.notes}</Text>
                </Card.Content>
              </Card>
            </Animated.View>
          );
        })
      )}
    </ScrollView>
  );
};

// -------------------- PROFILE SCREEN --------------------
const ProfileScreen = ({ sessions }) => {
  const totalSeconds = sessions.reduce((total, s) => total + s.duration, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalSessions = sessions.length;

  const calculateStreak = () => {
    if (!sessions.length) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date);
      const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
      if (i === 0 && diffDays > 0) break;
      if (diffDays === streak) streak++;
      else break;
    }
    return streak;
  };
  const streak = calculateStreak();

  const dailyGoalHours = 1;
  const progress = Math.min(totalHours / dailyGoalHours, 1);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Avatar.Icon size={100} icon="book" style={{ backgroundColor: colors.primary }} />
      <Text style={[styles.timerText, { fontSize: 22 }]}>Reader Profile</Text>
      <Text>🔥 Current Streak: {streak} days</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Total Time Read: {totalHours} hrs</Text>
          <Text>Total Sessions: {totalSessions}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Daily Goal: {dailyGoalHours} hr</Text>
          <ProgressBar progress={progress} color={colors.primary} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// -------------------- STUB SCREENS --------------------
const MotivationScreen = () => (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Text style={{ color: colors.primary, fontSize: 18 }}>Motivation Screen</Text>
  </View>
);

const AchievementsScreen = ({ sessions }) => (
  <View style={[styles.container, { backgroundColor: colors.background }]}>
    <Text style={{ color: colors.primary, fontSize: 18 }}>Achievements Screen</Text>
  </View>
);

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, alignItems: "center", justifyContent: "flex-start" },
  timerText: { fontSize: 56, fontWeight: "700", color: colors.textPrimary, marginVertical: 32 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginVertical: 12 },
  button: { flex: 1, marginHorizontal: 4, borderRadius: 8, alignItems: "center", justifyContent: "center", paddingVertical: 10 },
  buttonLabel: { color: colors.buttonText, fontWeight: "600" },
  card: { width: "100%", marginVertical: 8, borderRadius: 12, backgroundColor: colors.card, elevation: 2 },
  cardTitle: { color: colors.textPrimary, fontWeight: "600" },
  cardContent: { color: colors.textPrimary },
  notesText: { color: colors.textPrimary },
  input: { width: "100%", borderWidth: 1, borderColor: colors.primary, padding: 12, marginBottom: 16, borderRadius: 8, backgroundColor: "#fff", color: colors.textPrimary },
  savedText: { marginTop: 16, color: colors.secondary, fontWeight: "500" },
  historyTitle: { fontSize: 22, marginBottom: 16, color: colors.primary, fontWeight: "600" },
});