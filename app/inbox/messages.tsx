import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PageHeader } from "../../components/ui/PageHeader";

const MESSAGE_PLACEHOLDERS = [
  { id: "1", sender: "WeVersity Team", snippet: "Welcome to the community!" },
  { id: "2", sender: "Andrew Ainsley", snippet: "Let's schedule the next session." },
];

export default function MessagesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PageHeader title="Messages" />

      <Text style={styles.helperText}>
        Stay in touch with your mentors and classmates. We&apos;ll show your most recent conversations here.
      </Text>

      <View style={styles.list}>
        {MESSAGE_PLACEHOLDERS.map((message) => (
          <View key={message.id} style={styles.card}>
            <Text style={styles.sender}>{message.sender}</Text>
            <Text style={styles.snippet}>{message.snippet}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  helperText: {
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  sender: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  snippet: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 14,
  },
});
