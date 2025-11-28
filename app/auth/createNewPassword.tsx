import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    CheckedCheckboxIcon,
    EyeIcon,
    PasswordIcon,
    UncheckedCheckboxIcon,
} from "../../components/icons";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";
const newPassImg = require("../../assets/images/newpasswrordcreate.png");

export default function CreateNewPassowrdScreen() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    return (
        <View style={styles.container}>
            {/* 🔹 Header with Back button and Title */}
            <HeaderWithBackButton title="Create New Password" />

            {/* 🔹 Main Scrollable Content */}
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Image
                    source={newPassImg}
                    style={styles.illustration}
                    resizeMode="contain"
                />

                <Text style={styles.subtitle}>Create Your New Password</Text>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                        <PasswordIcon />
                    </View>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.iconRight}
                    >
                        <EyeIcon />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                        <PasswordIcon />
                    </View>
                    <TextInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        style={styles.input}
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.iconRight}
                    >
                        <EyeIcon />
                    </TouchableOpacity>
                </View>

                {/* Remember Me */}
                <TouchableOpacity
                    style={styles.rememberContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.8}
                >
                    {rememberMe ? <CheckedCheckboxIcon /> : <UncheckedCheckboxIcon />}
                    <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                {/* Continue Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                  onPress={() => router.push("/auth/congratulations")}
                >
                    <Text style={styles.continueText}
                    
                    >Continue</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    // illustrationContainer removed - HeaderWithBackButton handles placement
    
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        position: "relative",
        width: "100%",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 45,
        fontSize: 16,
        color: "#111827",
    },
    iconLeft: {
        position: "absolute",
        left: 15,
        top: "35%",
    },
    iconRight: {
        position: "absolute",
        right: 15,
        top: "35%",
    },
    rememberContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },
    rememberText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#111827",
    },
    continueButton: {
        width: "100%",
        backgroundColor: "#7C3AED",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 10,
    },
    continueText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    illustration: {
        width: '100%',
        height: 280,
        marginBottom: 20,
       
    },
});