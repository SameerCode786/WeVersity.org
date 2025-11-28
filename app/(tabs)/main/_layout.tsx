import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function MainLayout() {
    return (
        <MaterialTopTabs
            initialRouteName="Live"
            screenOptions={{
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: "600",
                    textTransform: "none",
                },
                tabBarIndicatorStyle: {
                    backgroundColor: "#7a20e1",
                    height: 3,
                    borderRadius: 3,
                },
                tabBarStyle: {
                    backgroundColor: "#fff",
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                },
                tabBarActiveTintColor: "#7a20e1",
                tabBarInactiveTintColor: "#6B7280",
            }}
        >
            <MaterialTopTabs.Screen name="Live" options={{ title: "Live" }} />
            <MaterialTopTabs.Screen name="Shorts" options={{ title: "Shorts" }} />
            <MaterialTopTabs.Screen name="Courses" options={{ title: "Courses" }} />
            <MaterialTopTabs.Screen name="Followers" options={{ title: "Followers" }} />
        </MaterialTopTabs>
    );
}
