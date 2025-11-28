import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackArrowIcon } from "../icons";

export interface BackButtonProps {
  inline?: boolean;
  onPress?: () => void;
}

export function BackButton({ inline, onPress }: BackButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) router.back();
      else router.push("/");
    }
  };

  return (
    <View
      style={[
        styles.container,
        inline ? styles.inline : styles.absolute,
        !inline && { top: insets.top + 10 },
      ]}
    >
      <Pressable
        style={styles.backButton}
        onPress={handlePress}
      >
        <BackArrowIcon size={28} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  absolute: {
    position: "absolute",
    left: 16,
  },
  inline: {
    position: "relative",
  },
  backButton: {
    padding: 12,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
  },
});

export default BackButton;