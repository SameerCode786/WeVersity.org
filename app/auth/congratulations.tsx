import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PageHeader } from "../../components/ui/PageHeader";

export default function PasswordSuccessScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 9000); // 9 seconds
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Loading modal view
  if (isVisible) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.iconWrapper}>
            <ActivityIndicator size={50} color="#7C3AED" />
          </View>
          <Text style={styles.modalTitle}>Congratulations!</Text>
          <Text style={styles.modalText}>
            Your account is ready to use. You will be redirected to the Home page in a few seconds.
          </Text>
        </View>
      </View>
    );
  }

  // 🔹 Main screen after modal
  return (
    <View style={styles.container}>
      <PageHeader title="Password Changed!" />

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          You have successfully changed your password. Please use your new password to log in.
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/(tabs)/main/Live")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 🔹 Centered content
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
  },

  continueButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 999,
    alignItems: "center",
    width: "100%",
  },

  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // 🔹 Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 10,
  },
  modalText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 15,
    marginHorizontal: 10,
  },
});

