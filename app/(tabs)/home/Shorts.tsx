import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// TopNavBar removed: using MaterialTopTabs in main/_layout.tsx as the single top navigation

const { width, height } = Dimensions.get("window");
const SHORT_HEIGHT = height - 140;

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface ShortItem {
  id: string;
  username: string;
  role: string;
  description: string;
  image: any;
  profileImage: any;
  likes: number;
  dislikes: number;
  comments: Comment[];
  hasLiked: boolean;
  hasDisliked: boolean;
  isMuted: boolean;
}

const shortsData: ShortItem[] = [
  {
    id: "1",
    username: "Priscilla Ekman",
    role: "UI/UX Designer",
    description: "Select which contact details\nshould we use to reset your\npassword",
    image: require("../../../assets/images/teacherone.jpg"),
    profileImage: require("../../../assets/images/teacherone.jpg"),
    likes: 0,
    dislikes: 0,
    comments: [],
    hasLiked: false,
    hasDisliked: false,
    isMuted: false,
  },
  {
    id: "2",
    username: "Sarah Johnson",
    role: "Full Stack Developer",
    description: "Learn the best coding practices\nwith me! 💻\n#coding #webdev",
    image: require("../../../assets/images/teachertwo.jpg"),
    profileImage: require("../../../assets/images/teachertwo.jpg"),
    likes: 0,
    dislikes: 0,
    comments: [],
    hasLiked: false,
    hasDisliked: false,
    isMuted: false,
  },
  {
    id: "3",
    username: "David Martinez",
    role: "Creative Director",
    description: "Master UI/UX design principles\n🎨 #design #ux #creative",
    image: require("../../../assets/images/teacherthree.jpg"),
    profileImage: require("../../../assets/images/teacherthree.jpg"),
    likes: 0,
    dislikes: 0,
    comments: [],
    hasLiked: false,
    hasDisliked: false,
    isMuted: false,
  },
];

export default function ShortsPage() {
  const [shorts, setShorts] = useState<ShortItem[]>(shortsData);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleLike = (id: string) => {
    setShorts((prevShorts: ShortItem[]) =>
      prevShorts.map((short: ShortItem) => {
        if (short.id === id) {
          if (short.hasLiked) {
            return { ...short, likes: short.likes - 1, hasLiked: false };
          } else {
            return {
              ...short,
              likes: short.likes + 1,
              dislikes: short.hasDisliked ? short.dislikes - 1 : short.dislikes,
              hasLiked: true,
              hasDisliked: false,
            };
          }
        }
        return short;
      })
    );
  };

  const handleDislike = (id: string) => {
    setShorts((prevShorts) =>
      prevShorts.map((short) => {
        if (short.id === id) {
          if (short.hasDisliked) {
            return { ...short, dislikes: short.dislikes - 1, hasDisliked: false };
          } else {
            return {
              ...short,
              dislikes: short.dislikes + 1,
              likes: short.hasLiked ? short.likes - 1 : short.likes,
              hasDisliked: true,
              hasLiked: false,
            };
          }
        }
        return short;
      })
    );
  };

  const toggleMute = (id: string) => {
    setShorts((prevShorts) =>
      prevShorts.map((short) =>
        short.id === id ? { ...short, isMuted: !short.isMuted } : short
      )
    );
  };

  const handleCommentPress = (id: string) => {
    setSelectedShortId(id);
    setCommentModalVisible(true);
  };

  const handleAddComment = () => {
    if (commentText.trim() && selectedShortId) {
      const newComment: Comment = {
        id: Date.now().toString(),
        username: "You",
        text: commentText.trim(),
        timestamp: "Just now",
      };

      setShorts((prevShorts) =>
        prevShorts.map((short) =>
          short.id === selectedShortId
            ? { ...short, comments: [...short.comments, newComment] }
            : short
        )
      );

      setCommentText("");
    }
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return "";
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const renderShort = ({ item }: { item: ShortItem }) => (
    <View style={styles.shortContainer}>
      <Image source={item.image} style={styles.shortImage} resizeMode="cover" />

      <View style={styles.overlay}>
        <View style={styles.bottomContent}>
          <View style={styles.userInfoContainer}>
            <View style={styles.profileRow}>
              <Image
                source={item.profileImage}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.userTextContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.role}>{item.role}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons
              name={item.hasLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={32}
              color="white"
            />
            {item.likes > 0 && (
              <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDislike(item.id)}
          >
            <Ionicons
              name={item.hasDisliked ? "thumbs-down" : "thumbs-down-outline"}
              size={32}
              color="white"
            />
            {item.dislikes > 0 && (
              <Text style={styles.actionText}>{formatNumber(item.dislikes)}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCommentPress(item.id)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={32} color="white" />
            {item.comments.length > 0 && (
              <Text style={styles.actionText}>{item.comments.length}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleMute(item.id)}
          >
            <Ionicons
              name={item.isMuted ? "volume-mute" : "volume-high"}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const selectedShort = shorts.find((s) => s.id === selectedShortId);

  return (
    <View style={styles.container}>

      <FlatList
        data={shorts}
        renderItem={renderShort}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SHORT_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: SHORT_HEIGHT,
          offset: SHORT_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalOverlay} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Comments ({selectedShort?.comments.length || 0})
              </Text>
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsList}>
              {selectedShort?.comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Ionicons name="person-circle" size={40} color="#666" />
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUsername}>
                        {comment.username}
                      </Text>
                      <Text style={styles.commentTimestamp}>
                        {comment.timestamp}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              ))}
              {selectedShort?.comments.length === 0 && (
                <View style={styles.noComments}>
                  <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                  <Text style={styles.noCommentsText}>No comments yet</Text>
                  <Text style={styles.noCommentsSubtext}>
                    Be the first to comment!
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#999"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !commentText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleAddComment}
                disabled={!commentText.trim()}
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={commentText.trim() ? "#007AFF" : "#ccc"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  shortContainer: {
    width: width,
    height: SHORT_HEIGHT,
    position: "relative",
  },
  shortImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: 12,
    flexDirection: "row",
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingRight: 8,
  },
  userInfoContainer: {
    gap: 6,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "white",
  },
  userTextContainer: {
    flex: 1,
    gap: 2,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  role: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  description: {
    color: "white",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  actionsContainer: {
    width: 60,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
    gap: 20,
  },
  actionButton: {
    alignItems: "center",
    gap: 2,
  },
  actionText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: Platform.OS === "ios" ? 34 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    maxHeight: height * 0.4,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: "row",
    paddingVertical: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  commentText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  noComments: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginTop: 12,
  },
  noCommentsSubtext: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: "#333",
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
