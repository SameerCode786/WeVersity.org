import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabaseClient } from "../../backend/supabase/client";
import { AppleIcon, EmailIcon, FacebookIcon, GoogleIcon, PasswordIcon } from "../../components/icons";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";
import { useAuth } from "../../contexts/AuthContext";

export default function SignupWithPasswordScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const { email: paramEmail, verified } = useLocalSearchParams<{ email?: string; verified?: string }>();

  const [email, setEmail] = useState(paramEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    // Load email from storage if not in params
    if (!paramEmail) {
      AsyncStorage.getItem("pendingVerificationEmail").then((storedEmail) => {
        if (storedEmail) setEmail(storedEmail);
      });
    }
  }, [paramEmail]);

  // pre-fill email if route param provided
  useEffect(() => {
    if (paramEmail) setEmail(paramEmail);
  }, [paramEmail]);

  // Show success message if verified
  useEffect(() => {
    if (verified === 'true') {
      Alert.alert('Success', 'Your email has been verified! Please sign in.');
    }
  }, [verified]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("Login Error Details:", error); // Log the full error
        const em = (error?.message || '').toLowerCase();
        if (em.includes('invalid') || em.includes('credentials') || em.includes('password') || em.includes('email')) {
          throw new Error('Invalid credentials');
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("Login failed");
      }

      // Get user profile to determine role
      const { data: profile, error: profileError } = await supabaseClient
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      await refreshUser();
      await AsyncStorage.removeItem("pendingVerificationEmail");

      // Route based on role (ensure role exists)
      const role = profile?.role;
      if (!role) {
        // If role missing, default to main
        console.warn('User role missing, defaulting to main');
        router.replace('/(tabs)/main/Live');
        return;
      }

      // Both roles now go to the Live page (due to initialRouteName setting)
      router.replace('/(tabs)/main/Live');
    } catch (error: any) {
      const message = error?.message || 'An error occurred during login';
      if (message === 'Invalid credentials') {
        Alert.alert('Invalid credentials', 'The email or password you entered is incorrect.');
      } else {
        Alert.alert('Login Failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <HeaderWithBackButton title={"Hi, Welcome back!"} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>

          <View style={styles.inputRow}>
            <View style={styles.iconWrapper}>
              <EmailIcon size={18} />
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.iconWrapper}>
              <PasswordIcon size={18} />
            </View>
            <TextInput
              style={styles.inputField}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeButtonRight}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity onPress={() => router.push('/auth/forgetPassword')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember((r) => !r)}>
              <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialCircle}><FacebookIcon /></TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle}><GoogleIcon /></TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle}><AppleIcon /></TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account yet? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/userSignUpPage')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 56,
    backgroundColor: "#fff",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
    paddingRight: 8,
  },
  eyeButtonRight: {
    padding: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 4,
    marginBottom: 12,
  },
  forgotText: {
    color: "#6B7280",
    fontSize: 13,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#7F56D9",
    borderColor: "#7F56D9",
  },
  rememberText: {
    color: "#374151",
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: "#7F56D9",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginBottom: 32,
  },
  socialCircle: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 6,
    backgroundColor: "#fff",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  signUpLink: {
    color: "#7F56D9",
    fontWeight: "600",
    fontSize: 13,
  },
});