import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { EmailIcon, SmsIcon } from "../../components/icons";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<"sms" | "email">("sms");

  return (
    <View style={styles.container}>
      {/* 🔹 Header with Back button and Title */}
      <HeaderWithBackButton title="Forgot Password" />
      
      {/* 🔹 Main Content Centered */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/forgetpassword.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Select which contact details should we use to reset your password
        </Text>

        {/* 🔹 Option: SMS */}
        <Pressable
          style={[styles.option, selected === "sms" && styles.selectedOption]}
          onPress={() => setSelected("sms")}
        >
          <SmsIcon color={selected === "sms" ? "#7C3AED" : "#9ca3af"} />
          <Text style={styles.optionText}>via SMS: +111 ******99</Text>
        </Pressable>

        {/* 🔹 Option: Email */}
        <Pressable
          style={[styles.option, selected === "email" && styles.selectedOption]}
          onPress={() => setSelected("email")}
        >
          <EmailIcon color={selected === "email" ? "#7C3AED" : "#9ca3af"} />
          <Text style={styles.optionText}>
            via Email: and***ley@yourdomain.com
          </Text>
        </Pressable>

        <Pressable style={styles.continueButton} onPress={() => router.push("/auth/forgetPasswordSecond") }>
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* headerRow removed - HeaderWithBackButton handles placement */

  // 🔹 Main Content Centered
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  // 🔹 Image
  image: {
    width: "100%",
    height: 180,
    marginBottom: 25,
  },

  // 🔹 Subtitle
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  // 🔹 Options
  option: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
    width: "100%",
  },
  selectedOption: {
    borderColor: "#7C3AED",
    backgroundColor: "#f5f3ff",
  },
  optionText: {
    color: "#111827",
    fontSize: 15,
  },
  continueButton: {
    alignSelf: "stretch",
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});