import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Redirect to the main Live tab — keep a single source of top navigation
const RedirectToMain = () => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/(tabs)/main/Live');
    }, [router]);
    return null;
};

// Mock user data
const user = {
    name: "Andrew Ainsley",
    avatar: require("../../assets/images/mentorone.png"),
};

// Slider banners data
const sliderBanners = [
    { text: "Today's Special", discount: 40, description: "Get a discount for every course order!", color: "#7C3AED" },
    { text: "Weekend Deal", discount: 25, description: "Special prices on all new courses!", color: "#3B82F6" },
    { text: "New Year Sale", discount: 50, description: "Start the year with new skills!", color: "#EF4444" },
    { text: "Flash Sale", discount: 30, description: "Limited time offer, hurry up!", color: "#F59E0B" },
    { text: "Student Discount", discount: 60, description: "Exclusive discounts for students!", color: "#10B981" },
];

// Mentor list data
const mentors = [
    { name: "Jacob", avatar: require("../../assets/images/mentorone.png") },
    { name: "Claire", avatar: require("../../assets/images/mentortwo.png") },
    { name: "Priscilla", avatar: require("../../assets/images/mentorthree.png") },
    { name: "Wade", avatar: require("../../assets/images/mentorfour.png") },
    { name: "Kathry", avatar: require("../../assets/images/mentorfive.png") },
];

// Course data
const skillCourses = [
    { id: 1, title: "3D Design Illustration", category: "3D Design", image: require("../../assets/images/3da.png"), price: "Free", rating: 456 },
    { id: 2, title: "Digital Entrepreneurship", category: "Entrepreneurship", image: require("../../assets/images/digitalEnterpreture.png"), price: "Free", rating: 456 },
    { id: 3, title: "Learn UX User Persona", category: "UX/UI Design", image: require("../../assets/images/learnUx.png"), price: "Free", rating: 456 },
];

const technicalCourses = [
    { id: 4, title: "Intro to Python", category: "Programming", image: require("../../assets/images/python.jpeg"), price: "$50", rating: 489 },
    { id: 5, title: "Web Development Basics", category: "Web Dev", image: require("../../assets/images/webdevelopment.jpeg"), price: "$45", rating: 512 },
    { id: 6, title: "Data Science with R", category: "Data Science", image: require("../../assets/images/Data Science.jpeg"), price: "$60", rating: 477 },
];

// Header component with greeting and icons
const WelcomeHeader = () => {
    const router = useRouter();
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={user.avatar} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
                <View>
                    <Text style={{ color: "gray" }}>Good Morning</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#111827" }}>{user.name}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity onPress={() => router.push("../../inbox/notifications")}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("../../courses/bookmarkcourse")}>
                    <Ionicons name="bookmark-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Search bar component
const SearchBar = () => (
    <View style={{ marginBottom: 24 }}>
        <View style={{ position: "absolute", left: 12, top: 12 }}>
            <Ionicons name="search-outline" size={20} color="gray" />
        </View>
        <TextInput
            placeholder="Search"
            style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 12,
                paddingVertical: 10,
                paddingLeft: 40,
                paddingRight: 16,
                color: "#111827",
            }}
        />
    </View>
);

// Slider component for special offers
const SpecialOfferSlider = () => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setIndex((prev) => (prev + 1) % sliderBanners.length), 4000);
        return () => clearInterval(timer);
    }, []);

    const banner = sliderBanners[index];
    return (
        <View style={{ backgroundColor: banner.color, borderRadius: 24, padding: 20, marginBottom: 24 }}>
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>{banner.text}</Text>
            <Text style={{ color: "white", opacity: 0.9 }}>{banner.description}</Text>
            <Text style={{ color: "white", fontSize: 48, fontWeight: "bold", marginTop: 8 }}>{banner.discount}%</Text>
        </View>
    );
};

// Mentor section component
const MentorSection = () => {
    const router = useRouter();
    return (
        <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Top Mentors</Text>
                <TouchableOpacity onPress={() => router.push("../../courses/topmentors")}>
                    <Text style={{ color: "#7C3AED", fontWeight: "600" }}>See All</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {mentors.map((m) => (
                    <View key={m.name} style={{ alignItems: "center" }}>
                        <Image source={m.avatar} style={{ width: 56, height: 56, borderRadius: 28 }} />
                        <Text style={{ marginTop: 4, fontSize: 13 }}>{m.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Individual course card component
const CourseCard = ({ course }: { course: any }) => (
    <View style={{ backgroundColor: "white", borderRadius: 20, flexDirection: "row", padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB" }}>
        <Image source={course.image} style={{ width: 80, height: 80, borderRadius: 12, marginRight: 12 }} />
        <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <View style={{ backgroundColor: "#EDE9FE", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, maxWidth: "75%" }}>
                    <Text style={{ color: "#7C3AED", fontSize: 11, fontWeight: "600" }}>{course.category}</Text>
                </View>
                <TouchableOpacity onPress={() => {/* bookmark logic placeholder */ }}>
                    <Ionicons name="bookmark-outline" size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: "bold", color: "#111827", marginBottom: 4 }}>{course.title}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#7C3AED", fontWeight: "600" }}>{course.price}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={{ color: "#111827", fontSize: 13, fontWeight: "600" }}>{course.rating?.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    </View>
);

// Main screen component (kept for backward compatibility). We now redirect to the main Live tab by default.
const WelcomeScreen = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("skill");
    const courses = activeTab === "skill" ? skillCourses : technicalCourses;

    // Redirect immediately — this keeps only the main TopNavBar visible (no duplicate topbars)
    return <RedirectToMain />;
};

const styles = StyleSheet.create({
    // Removed topTabs styles as they are now in TopNavBar component
});

export default WelcomeScreen;
