import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppleIcon, FacebookIcon, GoogleIcon } from "../../components/icons";

const SocialButton: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <View style={styles.socialButton}>
    {icon}
    <Text style={styles.socialButtonLabel}>{label}</Text>
  </View>
);

export default function UserFirstSignupPage() {
  const router = useRouter();

  const handleNext = (path: string) => {
    router.push(path as any);
  };

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
          <SocialButton icon={<FacebookIcon />} label="Continue with Facebook" />
          <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
          <SocialButton icon={<AppleIcon />} label="Continue with Apple" />
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
        <TouchableOpacity onPress={() => handleNext("/auth/userSignUpPage")}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
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
  },
  socialButton: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  socialButtonLabel: {
    fontWeight: "600",
    color: "#374151",
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
});