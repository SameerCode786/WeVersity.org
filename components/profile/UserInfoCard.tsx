import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface UserInfoCardProps {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ 
  name, 
  email, 
  role,
  avatarUrl 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarText}>
              {name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name || "User"}</Text>
        <Text style={styles.email}>{email || "user@example.com"}</Text>
        <View style={styles.roleContainer}>
          <Text style={styles.role}>{role || "student"}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7F56D9",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  roleContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF4FF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  role: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
});