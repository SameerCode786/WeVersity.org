import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect to home if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/(tabs)/home");
        }
    }, [isAuthenticated, router]);

    return <Stack screenOptions={{ headerShown: false }} />;
}