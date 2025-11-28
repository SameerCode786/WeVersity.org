import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

interface Teacher {
  id: string;
  name: string;
  image: any;
  role: string;
  coursesCount: number;
}

const teachers: Teacher[] = [
  {
    id: "1",
    name: "Steve M",
    image: require("../../assets/images/teacherone.jpg"),
    role: "Full Stack Developer",
    coursesCount: 4,
  },
  {
    id: "2",
    name: "Harvey J",
    image: require("../../assets/images/teachertwo.jpg"),
    role: "UI Designer",
    coursesCount: 9,
  },
  {
    id: "3",
    name: "Steve M",
    image: require("../../assets/images/teacherthree.jpg"),
    role: "Finance / Tech Expert",
    coursesCount: 4,
  },
  {
    id: "4",
    name: "Harvey J",
    image: require("../../assets/images/teacherone.jpg"),
    role: "UX/UI Designer",
    coursesCount: 9,
  },
];

type TopTab = "Live" | "Short" | "Courses" | "Followers";

export default function Mentors() {
  const router = useRouter();
  const [activeTab] = useState<TopTab>("Live");

  const handleTopTabPress = (tab: TopTab) => {
    if (tab === "Live") {
      router.push("/(tabs)/main/Live");
    } else if (tab === "Short") {
      router.push("/(tabs)/main/Shorts");
    } else if (tab === "Courses") {
      router.push("/(tabs)/main/Courses");
    } else if (tab === "Followers") {
      router.push("/(tabs)/main/Followers");
    }
  };

  const renderTeacherCard = ({ item, index }: { item: Teacher; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[styles.cardContainer, isLeft ? styles.cardLeft : styles.cardRight]}>
        <View style={styles.card}>
          <Image source={item.image} style={styles.teacherImage} />
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherRole}>{item.role}</Text>
          <Text style={styles.coursesCount}>{item.coursesCount < 10 ? `0${item.coursesCount}` : item.coursesCount} Courses</Text>
          <TouchableOpacity style={styles.seeClassButton}>
            <Text style={styles.seeClassText}>See Class</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTopTabs = () => (
    <View style={styles.topTabsContainer}>
      {(["Live", "Short", "Courses", "Followers"] as TopTab[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.topTabButton}
          onPress={() => handleTopTabPress(tab)}
        >
          <Text style={[styles.topTabText, activeTab === tab && styles.topTabTextActive]}>
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.topTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      {renderTopTabs()}

      {/* Teachers Grid */}
      <FlatList
        data={teachers}
        renderItem={renderTeacherCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    justifyContent: "center",
  },
  topTabButton: {
    marginHorizontal: 16,
    paddingBottom: 8,
  },
  topTabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },
  topTabTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  topTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#7a20e1",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  cardLeft: {
    marginRight: 8,
  },
  cardRight: {
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  teacherImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7a20e1",
    marginBottom: 4,
  },
  teacherRole: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  coursesCount: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  seeClassButton: {
    backgroundColor: "#7a20e1",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  seeClassText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
