import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";

export default function ForgotPasswordSecond() {
  const router = useRouter();

  // OTP state
  const [digits, setDigits] = useState(["", "", "", ""]);
  const ref0 = useRef<TextInput | null>(null);
  const ref1 = useRef<TextInput | null>(null);
  const ref2 = useRef<TextInput | null>(null);
  const ref3 = useRef<TextInput | null>(null);

  // Timer for resend
  const [timer, setTimer] = useState(53);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const onChange = (text: string, idx: number) => {
    const char = text.slice(-1);
    
    // Update the digit at the current index
    setDigits(prev => {
      const next = [...prev];
      next[idx] = char;
      return next;
    });

    // Move focus forward if a character was entered and it's not the last box
    if (char && idx < 3) {
      setTimeout(() => {
        [ref0, ref1, ref2, ref3][idx + 1].current?.focus();
      }, 10);
    }
    
    // Move focus backward if character was deleted and it's not the first box
    if (!char && idx > 0) {
      setTimeout(() => {
        [ref0, ref1, ref2, ref3][idx - 1].current?.focus();
      }, 10);
    }
  };

  const handleResend = () => {
    setTimer(53);
  };

  const handleContinue = () => {
    router.push("/auth/createNewPassword");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🔹 Header with Back button and Title */}
      <HeaderWithBackButton title="Forgot Password" />

      {/* 🔹 Main Content Centered */}
      <View style={styles.contentWrapper}>
        <Text style={styles.subtitle}>Code has been sent to +1 111 ******99</Text>

        {/* OTP Boxes */}
        <View style={styles.otpRow}>
          {[ref0, ref1, ref2, ref3].map((ref, idx) => (
            <TextInput
              key={idx}
              ref={ref}
              value={digits[idx]}
              onChangeText={(t) => onChange(t, idx)}
              onKeyPress={({ nativeEvent }) => {
                // Handle backspace key press
                if (nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
                  setTimeout(() => {
                    [ref0, ref1, ref2, ref3][idx - 1].current?.focus();
                  }, 10);
                }
              }}
              keyboardType="numeric"
              maxLength={1}
              style={styles.otpBox}
              textAlign="center"
              selectionColor="#7C3AED"
              autoFocus={idx === 0}
            />
          ))}
        </View>

        {/* Resend Timer */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.resendText}>
              Resend code in <Text style={styles.timer}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendText, styles.resendAction]}>
                Resend code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* headerRow removed - HeaderWithBackButton handles placement */

  // 🔹 Centered Content
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  resendRow: {
    marginBottom: 24,
    alignItems: "center",
  },
  resendText: {
    color: "#6b7280",
    fontSize: 13,
  },
  timer: {
    color: "#7C3AED",
    fontWeight: "700",
  },
  resendAction: {
    color: "#7C3AED",
    fontWeight: "700",
  },

  footer: {
    width: "100%",
    marginTop: 20,
  },
  continueButton: {
    alignSelf: "stretch",
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});