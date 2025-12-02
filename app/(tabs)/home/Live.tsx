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
    image: require("../../../assets/images/teacherone.jpg"),
    role: "Full Stack Developer",
    coursesCount: 4,
  },
  {
    id: "2",
    name: "Harvey J",
    image: require("../../../assets/images/teachertwo.jpg"),
    role: "UI/UX Designer",
    coursesCount: 2,
  },
  {
    id: "3",
    name: "Steve M",
    image: require("../../../assets/images/teacherthree.jpg"),
    role: "Amazon Fba Expert",
    coursesCount: 4,
  },
  {
    id: "4",
    name: "Harvey J",
    image: require("../../../assets/images/teacherone.jpg"),
    role: "Graphic Designer",
    coursesCount: 2,
  },
];

export default function LivePage() {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={teachers}
        renderItem={renderTeacherCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
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
  listContent: {
    padding: 16,
    paddingTop: 24,
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
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  teacherImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8B5CF6", // Purple-ish
    marginBottom: 4,
  },
  teacherRole: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 8,
  },
  coursesCount: {
    fontSize: 12,
    color: "#0D9488", // Teal/Blue
    fontWeight: "600",
    marginBottom: 12,
  },
  seeClassButton: {
    backgroundColor: "#8B5CF6",
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
