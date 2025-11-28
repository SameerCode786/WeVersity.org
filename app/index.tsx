import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const slides = [
  {
    image: require("../assets/images/sliderone.jpg"),
    text: "Learn anytime and anywhere easily and conveniently"
  },
  {
    image: require("../assets/images/slidertwo.png"),
    text: "We provide the best learning courses & great mentors!"
  },
  {
    image: require("../assets/images/sliderthree.jpg"),
    text: "Let's improve your skills together right now!"
  }
];

export default function Index() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/main/Live");
    }
  }, [isAuthenticated, router]);

  const handleNext = () => {
    router.replace("/auth/userFirstSignupPage");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          key={currentIndex}
          source={slides[currentIndex].image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.heading}>{slides[currentIndex].text}</Text>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <Pressable onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  image: {
    width: "100%",
    height: 300,
  },
  heading: {
    fontSize: 33,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 36,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 64,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  activeDot: {
    width: 24,
    backgroundColor: "#6322E4",
  },
  nextButton: {
    backgroundColor: "#6322E4",
    marginHorizontal: 20,
    marginBottom: 90,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
