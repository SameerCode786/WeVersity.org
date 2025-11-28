import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton } from "../../components/buttons/BackButton";

const mentors = [
  { name: "Jacob Kulikowski", role: "Marketing Analyst", avatar: require("../../assets/images/mentor_one.png") },
  { name: "Priscilla Ehrman", role: "UX Designer", avatar: require("../../assets/images/mentor_two.png") },
  { name: "Claire Ordonez", role: "VP of Sales", avatar: require("../../assets/images/mentor_three.png") },
  { name: "Wade Chenail", role: "Manager, Solution Engineering", avatar: require("../../assets/images/mentor_four.png") },
  { name: "Francene Vandryne", role: "Product Manager", avatar: require("../../assets/images/mentor_five.png") },
  { name: "Benny Spanbauer", role: "Senior Product Manager", avatar: require("../../assets/images/mentor_one.png") },
  { name: "Jamel Eusebio", role: "Product Designer", avatar: require("../../assets/images/mentor_two.png") },
  { name: "Cyndy Lillibridge", role: "VP of Marketing", avatar: require("../../assets/images/mentor_three.png") },
];

export default function TopMentorsPage() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filteredMentors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return mentors;
    return mentors.filter((m) => m.name.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerRow, { paddingTop: insets.top + 10 }]}>
        <BackButton inline />
        <Text style={styles.headerTitle}>Top Mentors</Text>
        <Pressable hitSlop={12} style={styles.searchBtn}>
          <Ionicons name="search" size={20} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search mentors by name"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredMentors}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
            <Pressable style={styles.chatBtn} hitSlop={10}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#111827" />
            </Pressable>
          </View>
        )}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginLeft: 10, flex: 1 },
  searchBtn: { padding: 8 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    padding: 0,
    margin: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  name: { fontSize: 14, fontWeight: "700", color: "#111827" },
  role: { fontSize: 12, color: "gray", marginTop: 2 },
  chatBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
});


