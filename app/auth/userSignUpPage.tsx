import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import * as auth from "../../backend/auth/exports";
import { AppleIcon, FacebookIcon, GoogleIcon } from "../../components/icons";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";
import { useAuth } from "../../contexts/AuthContext";

// Enum for role type
enum UserRole {
  Student = "Student",
  Teacher = "Teacher",
}

// Presentational components defined at module scope and memoized
const RoleSelector = React.memo(function RoleSelector({
  activeRole,
  onRoleChange,
}: {
  activeRole: UserRole;
  onRoleChange: (r: UserRole) => void;
}) {
  return (
    <View style={styles.roleContainer}>
      <TouchableOpacity
        onPress={() => onRoleChange(UserRole.Teacher)}
        style={[styles.roleButton, activeRole === UserRole.Teacher && styles.roleButtonActive]}
      >
        <Text style={[styles.roleText, activeRole === UserRole.Teacher && styles.roleTextActive]}>Instructor</Text>
      </TouchableOpacity>

      <View style={styles.roleDivider} />

      <TouchableOpacity
        onPress={() => onRoleChange(UserRole.Student)}
        style={[styles.roleButton, activeRole === UserRole.Student && styles.roleButtonActive]}
      >
        <Text style={[styles.roleText, activeRole === UserRole.Student && styles.roleTextActive]}>Student</Text>
      </TouchableOpacity>
    </View>
  );
});

const InputField = React.memo(function InputField({
  name,
  placeholder,
  value,
  onChange,
  inputRef,
  onSubmitEditing,
  secureTextEntry,
  keyboardType,
  error,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (name: string, value: string) => void;
  inputRef?: React.RefObject<any>;
  onSubmitEditing?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  error?: string;
}) {
  return (
    <View>
      <TextInput
        ref={inputRef}
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={(text: string) => onChange(name, text)}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        blurOnSubmit={false}
        returnKeyType="next"
        onSubmitEditing={onSubmitEditing}
      />
      {error ? (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
});

const SocialButton = React.memo(function SocialButton({ icon }: { icon: React.ReactNode }) {
  return <TouchableOpacity style={styles.socialButton}>{icon}</TouchableOpacity>;
});

function UserSignUpPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const phoneInput = useRef<any>(null);

  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
    teacherRole: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneError, setPhoneError] = useState("");

  // refs for focusing next input
  const firstNameRef = useRef<any>(null);
  const lastNameRef = useRef<any>(null);
  const userNameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const passwordConfirmRef = useRef<any>(null);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = "Please fill in this field.";
    if (!formData.userName?.trim()) newErrors.userName = "Please fill in this field.";
    if (!formData.email?.trim()) newErrors.email = "Please fill in this field.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!formData.password) newErrors.password = "Please fill in this field.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.passwordConfirmation) newErrors.passwordConfirmation = "Please fill in this field.";
    else if (formData.password !== formData.passwordConfirmation) newErrors.passwordConfirmation = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !phoneError;
  }, [formData, phoneError]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;
    const formattedPhoneNumber = (phoneInput.current as any)?.getNumberAfterPossiblyEliminatingZero?.()?.formattedNumber;
    if (!formattedPhoneNumber) {
      setPhoneError("Invalid phone number format.");
      return;
    }
    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload: any = {
        email: formData.email,
        password: formData.password,
        fullName,
        userName: formData.userName,
        phoneNumber: formattedPhoneNumber,
      };
      if (role === UserRole.Teacher) payload.expertise = formData.teacherRole;
      if (role === UserRole.Student) await auth.signupStudent(payload as any);
      else await auth.signupTeacher(payload as any);
      
      // Refresh the user context to update authentication state
      await refreshUser();
      
      // After successful signup, go straight to the app Home (Live) screen.
      Alert.alert("Account created", "Your account has been created. Redirecting to Home.");
      router.replace("/(tabs)/main/Live");
      return;
    } catch (error: any) {
      const msg = (error?.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("duplicate") || msg.includes("registered")) {
        Alert.alert("Email already used", "An account with this email already exists. Please sign in or use another email.");
      } else {
        Alert.alert("Signup failed", error.message || "An error occurred during signup");
      }
    } finally {
      setLoading(false);
    }
  }, [validateForm, formData, role, router, refreshUser]);

  const handleInputChange = useCallback((name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev: Record<string, string>) => {
      const newErrors = { ...prev } as Record<string, string>;
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const handlePhoneChange = useCallback((text: string) => {
    setFormData((prev: any) => ({ ...prev, phoneNumber: text }));
    setPhoneError("");
  }, []);

  const handleRoleChange = useCallback((r: UserRole) => setRole(r), []);

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}>
      <HeaderWithBackButton title="Create Account" />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.subtitle}>{role === UserRole.Student ? "Sign up as a Student" : "Sign up as an Instructor"}</Text>

          <RoleSelector activeRole={role} onRoleChange={handleRoleChange} />

          <View style={styles.form}>
            <Text style={styles.label}>First Name <Text style={styles.required}>*</Text></Text>
            <InputField name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} inputRef={firstNameRef} onSubmitEditing={() => lastNameRef.current?.focus()} error={errors.firstName} />

            <Text style={styles.label}>Last Name</Text>
            <InputField name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} inputRef={lastNameRef} onSubmitEditing={() => userNameRef.current?.focus()} />

            <Text style={styles.label}>User Name <Text style={styles.required}>*</Text></Text>
            <InputField name="userName" placeholder="User Name" value={formData.userName} onChange={handleInputChange} inputRef={userNameRef} onSubmitEditing={() => emailRef.current?.focus()} error={errors.userName} />

            <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
            <InputField name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} inputRef={emailRef} onSubmitEditing={() => passwordRef.current?.focus()} keyboardType="email-address" error={errors.email} />

            {role === UserRole.Teacher && (
              <>
                <Text style={styles.label}>Your Role <Text style={styles.required}>*</Text></Text>
                <InputField name="teacherRole" placeholder="e.g., Graphics Teacher" value={formData.teacherRole} onChange={handleInputChange} error={errors.teacherRole} />
              </>
            )}

            <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
            <View style={[styles.phoneContainer, phoneError && styles.phoneContainerError]}>
              <PhoneInput ref={phoneInput} defaultValue={formData.phoneNumber} defaultCode="PK" layout="first" onChangeText={handlePhoneChange} containerStyle={styles.phoneInputContainer} textContainerStyle={styles.phoneTextContainer} textInputStyle={styles.phoneTextInput} codeTextStyle={styles.phoneCodeText} flagButtonStyle={styles.phoneFlagButton} countryPickerButtonStyle={styles.phoneCountryPicker} textInputProps={{ placeholder: "Phone Number", placeholderTextColor: "#9CA3AF", autoComplete: "tel", autoCorrect: false, spellCheck: false }} />
            </View>
            {phoneError ? (
              <View style={styles.errorContainer}>
                <FontAwesome name="exclamation-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{phoneError}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
            <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
              <TextInput ref={passwordRef} style={styles.passwordInput} placeholder="Password" value={formData.password} onChangeText={(text: string) => handleInputChange("password", text)} secureTextEntry={!showPassword} placeholderTextColor="#9CA3AF" blurOnSubmit={false} returnKeyType="next" onSubmitEditing={() => passwordConfirmRef.current?.focus()} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}><FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#9CA3AF" /></TouchableOpacity>
            </View>
            {errors.password && (
              <View style={styles.errorContainer}><FontAwesome name="exclamation-circle" size={16} color="#EF4444" /><Text style={styles.errorText}>{errors.password}</Text></View>
            )}

            <Text style={styles.label}>Re-type Password <Text style={styles.required}>*</Text></Text>
            <View style={[styles.passwordContainer, errors.passwordConfirmation && styles.inputError]}>
              <TextInput ref={passwordConfirmRef} style={styles.passwordInput} placeholder="Re-type Password" value={formData.passwordConfirmation} onChangeText={(text: string) => handleInputChange("passwordConfirmation", text)} secureTextEntry={!showPasswordConfirmation} placeholderTextColor="#9CA3AF" blurOnSubmit={false} returnKeyType="done" onSubmitEditing={handleRegister} />
              <TouchableOpacity onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)} style={styles.eyeButton}><FontAwesome name={showPasswordConfirmation ? "eye-slash" : "eye"} size={20} color="#9CA3AF" /></TouchableOpacity>
            </View>
            {errors.passwordConfirmation && (
              <View style={styles.errorContainer}><FontAwesome name="exclamation-circle" size={16} color="#EF4444" /><Text style={styles.errorText}>{errors.passwordConfirmation}</Text></View>
            )}
          </View>

          <TouchableOpacity onPress={handleRegister} style={styles.continueButton} disabled={loading}><Text style={styles.continueText}>{loading ? "Creating Account..." : "Register"}</Text></TouchableOpacity>

          <View style={styles.dividerRow}><View style={styles.dividerLine} /><Text style={styles.dividerText}>or continue with</Text><View style={styles.dividerLine} /></View>

          <View style={styles.socialRow}><SocialButton icon={<GoogleIcon />} /><SocialButton icon={<FacebookIcon />} /><SocialButton icon={<AppleIcon />} /></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  container: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#6B7280", marginBottom: 20, textAlign: "center" },
  roleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 6, marginTop: 20, marginBottom: 24, width: "100%", backgroundColor: "#fff" },
  roleButton: { flex: 1, paddingVertical: 14, alignItems: "center", borderRadius: 10, backgroundColor: "#fff" },
  roleButtonActive: { backgroundColor: "#7F56D9" },
  roleText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  roleTextActive: { color: "#fff" },
  roleDivider: { width: 1, height: 28, backgroundColor: "#E5E7EB", marginHorizontal: 10 },
  form: { alignSelf: "stretch" },
  label: { fontSize: 14, color: "#374151", marginBottom: 6, marginTop: 6, fontWeight: "600" },
  required: { color: "#EF4444" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12, fontSize: 16, color: "#111827" },
  inputError: { borderColor: "#EF4444", borderWidth: 2 },
  errorContainer: { flexDirection: "row", alignItems: "center", marginTop: -8, marginBottom: 12, gap: 6 },
  errorText: { color: "#EF4444", fontSize: 13 },
  phoneContainer: { width: "100%", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, marginBottom: 12, backgroundColor: "#fff" },
  phoneContainerError: { borderColor: "#EF4444", borderWidth: 2 },
  phoneInputContainer: { width: "100%", backgroundColor: "transparent" },
  phoneTextContainer: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 0 },
  phoneTextInput: { fontSize: 16, color: "#111827", paddingVertical: 12 },
  phoneCodeText: { fontSize: 16, color: "#111827", fontWeight: "500" },
  phoneFlagButton: { paddingHorizontal: 8 },
  phoneCountryPicker: { paddingHorizontal: 8 },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 16, marginBottom: 12, backgroundColor: "#fff" },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#111827" },
  eyeButton: { padding: 8 },
  continueButton: { backgroundColor: "#7F56D9", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 20, alignSelf: "stretch" },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 24, alignSelf: "stretch" },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { marginHorizontal: 12, color: "#6B7280", fontSize: 14, fontWeight: "500" },
  socialRow: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch", marginBottom: 32 },
  socialButton: { flex: 1, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginHorizontal: 6, backgroundColor: "#fff" },
});

export default UserSignUpPage;