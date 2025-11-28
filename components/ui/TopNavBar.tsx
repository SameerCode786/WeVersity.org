import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TopTab = "Live" | "Short" | "Courses" | "Followers";

interface TopNavBarProps {
    activeTab: TopTab;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ activeTab }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleTabPress = (tab: TopTab) => {
        if (tab === activeTab) return;

        switch (tab) {
            case "Live":
                router.push("/(tabs)/main/Live");
                break;
            case "Short":
                router.push("/(tabs)/main/Shorts");
                break;
            case "Courses":
                router.push("/(tabs)/main/Courses");
                break;
            case "Followers":
                router.push("/(tabs)/main/Followers");
                break;
        }
    };

    return (
        <View style={[styles.topTabsWrapper, { paddingTop: insets.top }]}>
            <View style={styles.topTabsContainer}>
                {(["Live", "Short", "Courses", "Followers"] as TopTab[]).map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.topTabButton, isActive && styles.topTabButtonActive]}
                            onPress={() => handleTabPress(tab)}
                        >
                            <Text style={[styles.topTabText, isActive && styles.topTabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topTabsWrapper: {
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingBottom: 8, // Add some bottom padding
        paddingTop: 8, // Add some top padding
        borderBottomWidth: 1, // Make border more visible
        borderBottomColor: "#e5e7eb", // Use a softer gray color
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2, // Add subtle elevation for Android
    },
    topTabsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Centered as requested
        gap: 20, // Add gap for spacing
    },
    topTabButton: {
        paddingVertical: 12,
        borderBottomWidth: 3,
        borderBottomColor: "transparent",
        paddingHorizontal: 4,
        marginHorizontal: 8, // Add horizontal margin for spacing
    },
    topTabButtonActive: {
        borderBottomColor: "#7C3AED",
        // Add a subtle background highlight for active tab
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        borderRadius: 8,
    },
    topTabText: {
        fontSize: 17, // Slightly larger font
        fontWeight: "600", // Slightly bolder
        color: "#6B7280", // Softer gray color
    },
    topTabTextActive: {
        color: "#7C3AED", // Use purple color for active text
        fontWeight: "800", // Much bolder for active state
        fontSize: 18, // Slightly larger for active state
    },
});
