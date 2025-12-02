import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getFollowedTeachers, unfollowTeacher } from "../../../backend/followers";
// TopNavBar removed: using MaterialTopTabs in main/_layout.tsx as the single top navigation
import { useAuth } from "../../../contexts/AuthContext";

interface FollowedTeacher {
  id: string;
  teacher: {
    id: string;
    full_name: string;
    avatar_url: string;
    expertise: string;
  };
}

export default function FollowersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<FollowedTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFollowedTeachers = async () => {
    if (!user) return;
    try {
      const data = await getFollowedTeachers(user.id);
      setTeachers(data as any);
    } catch (error) {
      console.error("Error fetching followed teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowedTeachers();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFollowedTeachers();
  }, [user, fetchFollowedTeachers]);

  const handleUnfollow = async (teacherId: string) => {
    if (!user) return;
    Alert.alert(
      "Unfollow Teacher",
      "Are you sure you want to unfollow this teacher?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unfollow",
          style: "destructive",
          onPress: async () => {
            try {
              await unfollowTeacher(user.id, teacherId);
              setTeachers((prev: FollowedTeacher[]) => prev.filter((t: FollowedTeacher) => t.teacher.id !== teacherId));
              Alert.alert("Success", "Unfollowed teacher");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  };

  const renderTeacher = ({ item }: { item: FollowedTeacher }) => (
    <View style={styles.teacherCard}>
      <Image
        source={
          item.teacher.avatar_url
            ? { uri: item.teacher.avatar_url }
            : require("../../../assets/images/teacherone.jpg")
        }
        style={styles.avatar}
      />
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.teacher.full_name}</Text>
        <Text style={styles.teacherExpertise}>{item.teacher.expertise || "Instructor"}</Text>
      </View>
      <TouchableOpacity
        style={styles.unfollowButton}
        onPress={() => handleUnfollow(item.teacher.id)}
      >
        <Ionicons name="person-remove" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>You&apos;re not following any teachers yet.</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/(tabs)/home/Live")}
            >
              <Text style={styles.browseButtonText}>Browse Teachers</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingTop: 24,
  },
  teacherCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f3f4f6",
  },
  teacherInfo: {
    flex: 1,
    marginLeft: 16,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  teacherExpertise: {
    fontSize: 14,
    color: "#6B7280",
  },
  unfollowButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  browseButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
