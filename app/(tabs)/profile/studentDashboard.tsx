import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserInfoCard } from "../../../components/profile/UserInfoCard";
import { useAuth } from "../../../contexts/AuthContext";

export default function StudentDashboard({ profile }: { profile: any }) {
    const router = useRouter();
    const { user } = useAuth();
    const [welcomeOpacity] = useState(new Animated.Value(1));

    // Fade out welcome message after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(welcomeOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    const getInitial = (name?: string | null) => {
        if (!name) return "?";
        return name.charAt(0).toUpperCase();
    };

    const features = [
        {
            id: "live",
            title: "Watch Live Classes",
            icon: "videocam",
            color: "#EF4444",
            route: "/(tabs)/main/Live",
        },
        {
            id: "shorts",
            title: "Watch Shorts",
            icon: "play-circle",
            color: "#F59E0B",
            route: "/(tabs)/main/Shorts",
        },
        {
            id: "courses",
            title: "Browse Courses",
            icon: "library",
            color: "#3B82F6",
            route: "/(tabs)/main/Courses",
        },
        {
            id: "enrolled",
            title: "My Enrollments",
            icon: "school",
            color: "#10B981",
            route: "/(tabs)/main/Courses", // Filter for enrolled in real app
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="menu" size={24} color="#111827" />
                </TouchableOpacity>

                <Animated.View style={[styles.welcomeContainer, { opacity: welcomeOpacity }]}>
                    <Text style={styles.welcomeText}>
                        Welcome, {profile.full_name?.split(" ")[0] || "Student"}!
                    </Text>
                </Animated.View>

                <View style={styles.profileIcon}>
                    <Text style={styles.profileInitial}>{getInitial(profile.full_name)}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <UserInfoCard
                    name={profile.full_name}
                    email={user?.email}
                    role={profile.role}
                    avatarUrl={profile.avatar_url}
                />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.grid}>
                        {features.map((feature) => (
                            <TouchableOpacity
                                key={feature.id}
                                style={styles.card}
                                onPress={() => router.push(feature.route as any)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: feature.color + "20" }]}>
                                    <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                                </View>
                                <Text style={styles.cardTitle}>{feature.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recently Visited Teachers</Text>
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No recent teachers found.</Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/main/Live")}>
                            <Text style={styles.linkText}>Find Teachers</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Courses</Text>
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>You haven&apos;t enrolled in any courses yet.</Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/main/Courses")}>
                            <Text style={styles.linkText}>Browse Courses</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    menuButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeContainer: {
        flex: 1,
        alignItems: "center",
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#7F56D9",
        alignItems: "center",
        justifyContent: "center",
    },
    profileInitial: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    container: {
        paddingBottom: 40,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    card: {
        width: "47%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        textAlign: "center",
    },
    emptyState: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderStyle: "dashed",
    },
    emptyText: {
        color: "#6B7280",
        marginBottom: 8,
    },
    linkText: {
        color: "#7F56D9",
        fontWeight: "600",
    },
});
