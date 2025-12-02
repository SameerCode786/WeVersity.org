import { StyleSheet, Text, View } from "react-native";

export default function CoursesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Courses Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});
