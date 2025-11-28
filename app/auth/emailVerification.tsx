import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as auth from "../../backend/auth/exports";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";

export default function EmailVerificationScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email?: string }>();
    const [resending, setResending] = useState(false);

    const handleOpenEmailApp = async () => {
        try {
            // Try to open default email app
            await Linking.openURL("mailto:");
        } catch (error) {
            Alert.alert("Error", "Could not open email app. Please check your email manually.");
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            Alert.alert("Error", "Email address not found. Please try signing up again.");
            return;
        }

        setResending(true);
        try {
            await auth.resendVerificationEmail(email);
            Alert.alert("Success", "Verification email has been resent. Please check your inbox.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to resend verification email");
        } finally {
            setResending(false);
        }
    };

    const handleBackToLogin = () => {
        AsyncStorage.removeItem("pendingVerificationEmail");
        router.replace("/auth/signupWithPassword");
    };

    // Store email for later use
    React.useEffect(() => {
        if (email) {
            AsyncStorage.setItem("pendingVerificationEmail", email);
        }
    }, [email]);

    return (
        <View style={styles.wrapper}>
            <HeaderWithBackButton title="Verify Your Email" />
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Ionicons name="mail-outline" size={80} color="#7F56D9" />
                </View>

                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.description}>
                    We've sent a verification link to:
                </Text>
                <Text style={styles.email}>{email || "your email"}</Text>
                <Text style={styles.description}>
                    Click the link in the email to verify your account and complete your registration.
                </Text>

                <TouchableOpacity style={styles.primaryButton} onPress={handleOpenEmailApp}>
                    <Ionicons name="mail-open" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.primaryButtonText}>Open Email App</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleResendEmail}
                    disabled={resending}
                >
                    {resending ? (
                        <ActivityIndicator color="#7F56D9" />
                    ) : (
                        <>
                            <Ionicons name="refresh" size={20} color="#7F56D9" style={styles.buttonIcon} />
                            <Text style={styles.secondaryButtonText}>Resend Verification Email</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already verified? </Text>
                    <TouchableOpacity onPress={handleBackToLogin}>
                        <Text style={styles.linkText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
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
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
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
        marginBottom: 8,
        lineHeight: 24,
    },
    email: {
        fontSize: 16,
        fontWeight: "600",
        color: "#7F56D9",
        marginBottom: 16,
        textAlign: "center",
    },
    primaryButton: {
        flexDirection: "row",
        backgroundColor: "#7F56D9",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32,
        width: "100%",
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    secondaryButton: {
        flexDirection: "row",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        width: "100%",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    secondaryButtonText: {
        color: "#7F56D9",
        fontWeight: "600",
        fontSize: 16,
    },
    buttonIcon: {
        marginRight: 8,
    },
    footer: {
        flexDirection: "row",
        marginTop: 32,
    },
    footerText: {
        color: "#6B7280",
        fontSize: 14,
    },
    linkText: {
        color: "#7F56D9",
        fontWeight: "600",
        fontSize: 14,
    },
});
