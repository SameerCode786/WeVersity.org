import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useMemo } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getProfileRole, supabaseClient } from "../../backend/supabase/client";
import { AppleIcon, FacebookIcon, GoogleIcon } from "../../components/icons";

WebBrowser.maybeCompleteAuthSession();

const SocialButton: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <View style={styles.socialButton}>
    <View style={styles.socialIconContainer}>
      {icon}
    </View>
    <Text style={styles.socialButtonLabel}>{label}</Text>
  </View>
);

export default function UserFirstSignupPage() {
  const router = useRouter();

  // Build redirect URIs for different environments
  const expoProxyRedirect = useMemo(() => (AuthSession as any).makeRedirectUri({ useProxy: true }), []);
  const schemeRedirect = useMemo(() => (AuthSession as any).makeRedirectUri({ scheme: 'weversityorg' }), []);

  // Choose redirect based on app ownership (expo go vs standalone/dev client)
  const redirectTo = useMemo(() => {
    if (Constants.appOwnership === 'expo') return expoProxyRedirect; // Expo Go
    return schemeRedirect; // dev client or standalone
  }, [expoProxyRedirect, schemeRedirect]);

  useEffect(() => {
    console.log('Redirects -> proxy:', expoProxyRedirect, ' scheme:', schemeRedirect, ' selected:', redirectTo);
  }, [expoProxyRedirect, schemeRedirect, redirectTo]);

  // Listen for auth state changes to route based on stored role
  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('auth event', event);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const userId = session?.user?.id ?? (await supabaseClient.auth.getUser()).data?.user?.id;
        if (!userId) return;
        const role = await getProfileRole(userId);
        console.log('detected role', role);
        if (role === 'teacher') {
          router.replace('/profile/teacherDashboard');
        } else {
          router.replace('/profile/studentDashboard');
        }
      }
    });
    return () => subscription?.unsubscribe();
  }, [router]);

  const handleNext = (path: string) => {
    router.push(path as any);
  };

  const handleOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) {
        console.error('signInWithOAuth error', error);
        Alert.alert('Login error', error.message || 'Failed to start login');
        return;
      }

      const url = (data as any)?.url;
      if (!url) {
        console.warn('No url returned from signInWithOAuth', data);
        return;
      }

      if (Platform.OS === 'web') {
        window.location.href = url;
      } else {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (err) {
      console.error('handleOAuth error', err);
      Alert.alert('Unexpected error', String(err));
    }
  }, [redirectTo]);

  return (
    <ScrollView style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        <Image
          source={require("../../assets/images/login_image.png")}
          style={styles.loginImage}
        />
        
        <Text style={styles.titleText}>Let&apos;s you in</Text>

        <View style={styles.socialButtonsContainer}>
            <TouchableOpacity onPress={() => handleOAuth('facebook')}>
              <SocialButton icon={<FacebookIcon size={24} />} label="Continue with Facebook" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleOAuth('google')}>
              <SocialButton icon={<GoogleIcon size={24} />} label="Continue with Google" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleOAuth('apple')}>
              <SocialButton icon={<AppleIcon size={24} />} label="Continue with Apple" />
            </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign in Button */}
        <Pressable
          onPress={() => handleNext("/auth/signupWithPassword")}
          style={styles.signInButton}
        >
          <Text style={styles.signInButtonText}>Sign in with password</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
        <TouchableOpacity onPress={() => handleNext("/auth/userSignUpPage") }>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Debug: show Expo redirect URI in development so it can be copied if console logs are not visible */}
      {/* {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugLabel}>Expo Redirect URI (DEV):</Text>
          <Text selectable style={styles.debugValue}>{expoRedirect}</Text>
        </View>
      )} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    paddingTop: 20, // Add some padding to account for header
  },
  loginImage: {
    width: 240,
    height: 240,
    resizeMode: "contain",
    marginBottom: -7,
  },
  titleText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 27,
    textAlign: "center",
  },
  socialButtonsContainer: {
    alignSelf: "stretch",
    marginBottom: 20,
  },
  socialButton: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonLabel: {
    fontWeight: "600",
    color: "#374151",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    alignSelf: "stretch",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  signInButton: {
    alignSelf: "stretch",
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
    marginTop: 30,
  },
  footerText: {
    color: "#6b7280",
  },
  signUpText: {
    color: "#4F46E5",
    fontWeight: "600",
    marginLeft: 5,
  },
  debugContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
  },
  debugLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  debugValue: {
    fontSize: 13,
    color: '#111827',
  },
});