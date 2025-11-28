import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { resendVerificationEmail } from "../../backend/auth";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";

export default function VerificationScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!email) return;

        setResending(true);
        try {
            await resendVerificationEmail(email as string);
            Alert.alert("Email Sent", "A new verification email has been sent to your inbox.");
            setCountdown(60); // 60 seconds cooldown
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to resend email.");
        } finally {
            setResending(false);
        }
    };

    const handleOpenEmailApp = () => {
        // This is a placeholder. In a real app you might use `react-native-email-link` 
        // or just let the user switch apps manually.
        Alert.alert("Check Inbox", "Please switch to your email app to verify your account.");
    };

    return (
        <View style={styles.wrapper}>
            <HeaderWithBackButton title="Verification" />

            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/646/646094.png" }}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Verify your email</Text>

                <Text style={styles.description}>
                    We have sent a verification email to:
                </Text>
                <Text style={styles.email}>{email || "your email address"}</Text>

                <Text style={styles.subDescription}>
                    Please check your inbox and click the link to verify your account.
                </Text>

                <TouchableOpacity style={styles.primaryButton} onPress={handleOpenEmailApp}>
                    <Text style={styles.primaryButtonText}>Open Email App</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, (resending || countdown > 0) && styles.disabledButton]}
                    onPress={handleResendEmail}
                    disabled={resending || countdown > 0}
                >
                    {resending ? (
                        <ActivityIndicator color="#7F56D9" />
                    ) : (
                        <Text style={[styles.secondaryButtonText, (countdown > 0) && styles.disabledText]}>
                            {countdown > 0 ? `Resend Email in ${countdown}s` : "Resend Email"}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.textButton} onPress={() => router.replace("/auth/userSignUpPage")}>
                    <Text style={styles.textButtonText}>Back to Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -40, // Offset for header
    },
    iconContainer: {
        width: 100,
        height: 100,
        backgroundColor: "#F3F4F6",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    icon: {
        width: 50,
        height: 50,
        tintColor: "#7F56D9",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        textAlign: "center",
        marginBottom: 12,
    },
    subDescription: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 32,
        lineHeight: 20,
    },
    primaryButton: {
        backgroundColor: "#7F56D9",
        borderRadius: 12,
        paddingVertical: 14,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 14,
        width: "100%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 16,
    },
    disabledButton: {
        backgroundColor: "#F9FAFB",
        borderColor: "#E5E7EB",
    },
    secondaryButtonText: {
        color: "#374151",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledText: {
        color: "#9CA3AF",
    },
    textButton: {
        padding: 12,
    },
    textButtonText: {
        color: "#6B7280",
        fontSize: 14,
        fontWeight: "500",
    },
});
