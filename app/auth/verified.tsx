import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as auth from "../../backend/auth/exports";
import { supabaseClient } from "../../backend/supabase/client";

export function AuthVerifiedRedirect() {
    const router = useRouter();

    useEffect(() => {
        const handle = async () => {
            try {
                const url = await Linking.getInitialURL();
                // If there's no initial URL, try fallback to current linking URL
                const parsed = url ? new URL(url) : null;
                // Extract email if provided as query param
                const email = parsed?.searchParams.get('email') ?? undefined;

                // Redirect to the signupWithPassword route with verified flag
                const params: Record<string, string> = { verified: "true" };
                if (email) params.email = email;
                router.replace({ pathname: "/auth/signupWithPassword", params });
            } catch (error) {
                // On any failure, still navigate to the signup page with verified flag
                router.replace({ pathname: '/auth/signupWithPassword', params: { verified: 'true' } });
            }
        };

        handle();
    }, []);

    return (
        <View style={redirectStyles.center}>
            <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
    );
}
const redirectStyles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});

export default function VerifiedScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const init = async () => {
            // If the route already has ?verified=true, show success and redirect
            const verifiedParam = (params.verified as string) || undefined;
            const paramToken = (params.token || params.access_token) as string | undefined;

            if (verifiedParam === "true" && !paramToken) {
                setStatus("success");
                setMessage("Email verified successfully!");
                // preserve email if provided
                const email = (params.email as string) || undefined;
                setTimeout(() => {
                    router.replace({ pathname: "/auth/signupWithPassword", params: { verified: "true", ...(email ? { email } : {}) } });
                }, 1200);
                return;
            }

            // If token present in params, attempt server verification
            if (paramToken) {
                await handleEmailVerification(paramToken as string, (params.type as string) || undefined);
                return;
            }

            // As a fallback, try to read initial URL (deep link from external email)
            try {
                const url = await Linking.getInitialURL();
                if (url) {
                    const parsed = new URL(url);
                    const email = parsed.searchParams.get('email') || undefined;
                    const verified = parsed.searchParams.get('verified');
                    const token = parsed.searchParams.get('token') || parsed.searchParams.get('access_token');
                    const typeParam = parsed.searchParams.get('type') || undefined;

                    if (verified === 'true' && !token) {
                        setStatus('success');
                        setMessage('Email verified successfully!');
                        setTimeout(() => {
                            router.replace({ pathname: '/auth/signupWithPassword', params: { verified: 'true', ...(email ? { email } : {}) } });
                        }, 1200);
                        return;
                    }

                    if (token) {
                        await handleEmailVerification(token, typeParam);
                        return;
                    }
                }
            } catch (error) {
                // ignore and continue to attempt verification via params
            }

            // Nothing to verify, show error and redirect back
            setStatus('error');
            setMessage('Invalid verification link');
            setTimeout(() => router.replace('/auth/userFirstSignupPage'), 2000);
        };

        init();
    }, [params, router]);

    const handleEmailVerification = async (overrideToken?: string, overrideType?: string) => {
        try {
            const token = overrideToken || (params.token as string) || (params.access_token as string);
            const __typeParam = overrideType || (params.type as string) || undefined;

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                setTimeout(() => router.replace('/auth/userFirstSignupPage'), 2000);
                return;
            }

            // Try to verify with Supabase (best-effort; SDK may vary)
            const { data, error: _error } = await supabaseClient.auth.verifyOtp({ token_hash: token as string, type: 'email' } as any);

            if (_error) {
                console.error('Verification error:', _error);
                setStatus('error');
                setMessage('Verification failed. Please try again.');
                setTimeout(() => router.replace('/auth/userFirstSignupPage'), 2000);
                return;
            }

            if (data?.user) {
                try {
                    // Create profile now that user is verified
                    await auth.verifyAndCreateProfile(data.user.id);
                } catch (profileError) {
                    console.error('Profile creation error:', profileError);
                    // Continue anyway, user can try to sign in
                }

                setStatus('success');
                setMessage('Email verified successfully!');
                const email = data.user.email as string | undefined;
                setTimeout(() => {
                    router.replace({ pathname: '/auth/signupWithPassword', params: { verified: 'true', ...(email ? { email } : {}) } });
                }, 1200);
                return;
            }

            // If verification provided no user, still redirect to login with verified flag
            setStatus('success');
            setMessage('Email verified successfully!');
            setTimeout(() => router.replace({ pathname: '/auth/signupWithPassword', params: { verified: 'true' } }), 1200);
        } catch (_error) {
            console.error('Verification error:', _error);
            setStatus('error');
            setMessage('An error occurred during verification');
            setTimeout(() => router.replace('/auth/userFirstSignupPage'), 2000);
        }
    };

    return (
        <View style={styles.container}>
            {status === "verifying" && <ActivityIndicator size="large" color="#8B5CF6" />}
            {status === "success" && (
                <View style={styles.iconContainer}>
                    <Text style={styles.successIcon}>✓</Text>
                </View>
            )}
            {status === "error" && (
                <View style={styles.iconContainer}>
                    <Text style={styles.errorIcon}>✕</Text>
                </View>
            )}
            <Text style={[
                styles.message,
                status === "success" && styles.successText,
                status === "error" && styles.errorText
            ]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    successIcon: {
        fontSize: 48,
        color: "#10B981",
    },
    errorIcon: {
        fontSize: 48,
        color: "#EF4444",
    },
    message: {
        fontSize: 18,
        textAlign: "center",
        color: "#6B7280",
    },
    successText: {
        color: "#10B981",
        fontWeight: "600",
    },
    errorText: {
        color: "#EF4444",
        fontWeight: "600",
    },
});
