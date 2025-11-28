import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";
import { useBookmark } from "../../contexts/BookmarkContext";
import { allCoursesSeed, Course } from "../../data/courses";

const categories = ["All", "Skill", "Technical"];

export default function AllCoursesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { toggleBookmark, isBookmarked } = useBookmark();

  const filtered = useMemo(() => {
    const technicalCategories = new Set(["Programming", "Web Dev", "Data Science"]);

    return allCoursesSeed.filter((c) => {
      let matchCat = true;
      if (activeCategory === "Technical") {
        matchCat = technicalCategories.has(c.category);
      } else if (activeCategory === "Skill") {
        matchCat = !technicalCategories.has(c.category);
      }

      return matchCat;
    });
  }, [activeCategory]);

  const renderCourse = ({ item }: { item: Course }) => {
    const bookmarked = isBookmarked(item.id);

    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleBookmark(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={bookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color={bookmarked ? "#3B82F6" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.priceText}>{item.price}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={styles.ratingText}>{item.rating?.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderWithBackButton title="Most Popular Courses" inline />
      
      <View style={{ paddingHorizontal: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12, paddingRight: 4 }}
        >
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 }}
        renderItem={renderCourse}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // headerRow styles removed - HeaderWithBackButton handles this now
  
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#7C3AED",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED"
  },
  chipText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "white"
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: "75%",
  },
  categoryText: {
    color: "#7C3AED",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    color: "#7C3AED",
    fontWeight: "600",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
});