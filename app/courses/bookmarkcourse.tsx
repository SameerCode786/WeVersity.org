import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "../../components/buttons/BackButton";
import { useBookmark } from "../../contexts/BookmarkContext";
import { allCoursesSeed, Course } from "../../data/courses";

export default function BookmarkCoursePage() {
  const { bookmarkedCourses, toggleBookmark, isBookmarked, getBookmarkedCourses } = useBookmark();
  const courses = getBookmarkedCourses(allCoursesSeed);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      toggleBookmark(courseToDelete.id);
    }
    setDeleteModalVisible(false);
    setCourseToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setCourseToDelete(null);
  };

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
            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() => handleDeleteClick(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color="#EF4444"
                />
              </TouchableOpacity>
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
          </View>
          <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.priceText}>{item.price}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={[styles.ratingText, { marginLeft: 4 }]}>{item.rating?.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.headerRow}>
        <BackButton inline />
        <Text style={styles.headerTitle}>Bookmarked Courses</Text>
        <View style={styles.headerRightBtn} />
      </View>

      {bookmarkedCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Bookmarked Courses</Text>
          <Text style={styles.emptyText}>
            Start bookmarking courses from the &quot;Most Popular Courses&quot; page to see them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 }}
          renderItem={renderCourse}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={deleteModalVisible}
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalOverlayPressable}
            onPress={handleCancelDelete}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="trash-outline" size={48} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Remove Bookmark?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove &quot;{courseToDelete?.title}&quot; from your bookmarked courses?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.removeButton]}
                onPress={handleConfirmDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>Yes Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 10,
    flex: 1,
  },
  headerRightBtn: {
    width: 36,
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
    maxWidth: "60%",
  },
  categoryText: {
    color: "#7C3AED",
    fontSize: 11,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 4,
    marginRight: 12,
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
  },
  ratingText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalOverlayPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#EF4444",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
