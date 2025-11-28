import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BackButton } from "../../components/buttons/BackButton";

export default function TransactionsPage() {
  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.content}>
        <Text style={styles.title}>Transactions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
});
