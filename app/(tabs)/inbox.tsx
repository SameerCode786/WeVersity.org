import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TopTab = "Live" | "Short" | "Courses" | "Followers";

const TopTabsBar = ({ onTabPress }: { onTabPress: (tab: TopTab) => void }) => (
  <View style={styles.topTabsContainer}>
    {(["Live", "Short", "Courses", "Followers"] as TopTab[]).map((tab) => (
      <TouchableOpacity
        key={tab}
        style={styles.topTabButton}
        onPress={() => onTabPress(tab)}
      >
        <Text style={styles.topTabText}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function InboxTab() {
  const router = useRouter();

  const handleTopTabPress = (tab: TopTab) => {
    if (tab === "Live") {
      router.push("/(tabs)/main/Live");
    } else if (tab === "Short") {
      router.push("/(tabs)/main/Shorts");
    } else if (tab === "Courses") {
      router.push("/(tabs)/main/Courses");
    } else if (tab === "Followers") {
      router.push("/(tabs)/main/Followers");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <TopTabsBar onTabPress={handleTopTabPress} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.description}>Your messages will appear here</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  topTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    justifyContent: "center",
  },
  topTabButton: {
    marginHorizontal: 16,
    paddingBottom: 8,
  },
  topTabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
  },
});


