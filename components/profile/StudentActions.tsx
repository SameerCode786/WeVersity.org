import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StudentActionsProps {
  onWatchLive: () => void;
  onViewCourses: () => void;
  onWatchShorts: () => void;
}

export const StudentActions: React.FC<StudentActionsProps> = ({ 
  onWatchLive,
  onViewCourses,
  onWatchShorts
}) => {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Student Actions</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton} onPress={onWatchLive}>
          <View style={styles.buttonIcon}>
            <Text style={styles.iconText}>🔴</Text>
          </View>
          <Text style={styles.buttonText}>Watch Live</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onViewCourses}>
          <View style={styles.buttonIcon}>
            <Text style={styles.iconText}>📚</Text>
          </View>
          <Text style={styles.buttonText}>My Courses</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onWatchShorts}>
          <View style={styles.buttonIcon}>
            <Text style={styles.iconText}>🎥</Text>
          </View>
          <Text style={styles.buttonText}>Watch Shorts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => router.push("/(tabs)/main/Courses")}
        >
          <View style={styles.buttonIcon}>
            <Text style={styles.iconText}>📖</Text>
          </View>
          <Text style={styles.buttonText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
});