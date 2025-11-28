import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { BookmarkProvider } from "../../contexts/BookmarkContext";

export default function TabsLayout() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth/userFirstSignupPage");
        }
    }, [isAuthenticated, router]);

    // Show nothing while checking authentication
    if (!isAuthenticated) {
        return null;
    }

    return (
        <BookmarkProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: "#7a20e1",
                    tabBarInactiveTintColor: "#9CA3AF",
                    tabBarStyle: {
                        backgroundColor: "#ffffff",
                        borderTopWidth: 0,
                        elevation: 12,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        height: Platform.OS === "ios" ? 90 : 70, // Increased height
                        paddingBottom: Platform.OS === "ios" ? 30 : 12, // Increased padding
                        paddingTop: 12,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingHorizontal: 20, // Add horizontal padding
                    },
                    tabBarItemStyle: {
                        marginHorizontal: 10, // Add spacing between tabs
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "600",
                        marginTop: 6, // Increase margin
                        marginBottom: 6, // Add bottom margin
                    },
                    tabBarIconStyle: {
                        marginTop: 6, // Add top margin to icons
                        marginBottom: 2, // Add bottom margin to icons
                    },
                }}
            >
                {/* Home Tab now points to 'main' directory which has the Top Tabs */}
                <Tabs.Screen
                    name="main"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="mycourse"
                    options={{
                        title: "My Course",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="Profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="inbox"
                    options={{
                        title: "Inbox",
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={24} color={color} />
                        ),
                    }}
                />

                {/* Hidden Routes */}
                <Tabs.Screen name="home" options={{ href: null }} />
                <Tabs.Screen name="profile" options={{ href: null }} />
                <Tabs.Screen name="mentors" options={{ href: null }} />
            </Tabs>
        </BookmarkProvider>
    );
}