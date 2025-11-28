import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TopNavBar } from "../../../components/ui/TopNavBar";

export default function CoursesPage() {
  return (
    <View style={styles.container}>
      <TopNavBar activeTab="Courses" />
      <View style={styles.content}>
        <Text>Courses Content Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
