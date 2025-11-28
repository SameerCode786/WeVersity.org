import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { HeaderWithBackButton } from "../../components/ui/HeaderWithBackButton";

type NotificationItemProps = {
  color: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

const NotificationItem = ({ color, iconName, title, subtitle }: NotificationItemProps) => {
  return (
    <View style={styles.itemWrapper}>
      <View style={[styles.itemIconWrapper, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={22} color="#fff" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default function NotificationsScreen() {
  return ( 
    <View style={styles.screen}>
      <HeaderWithBackButton title="Notifications" inline />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Today</Text>
        <NotificationItem
          color="#60A5FA"
          iconName="car-sport"
          title="Payment Successful!"
          subtitle="You have made a course payment"
        />
        <NotificationItem
          color="#F59E0B"
          iconName="pricetag"
          title="Today's Special Offers"
          subtitle="You get a special promo today!"
        />

        <Text style={styles.sectionTitle}>Yesterday</Text>
        <NotificationItem
          color="#EF4444"
          iconName="albums"
          title="New Category Courses!"
          subtitle="Now the 3D design course is available"
        />
        <NotificationItem
          color="#60A5FA"
          iconName="card"
          title="Credit Card Connected!"
          subtitle="Credit Card has been linked!"
        />

        <Text style={styles.sectionTitle}>December 22, 2024</Text>
        <NotificationItem
          color="#34D399"
          iconName="checkmark-done"
          title="Account Setup Successful!"
          subtitle="Your account has been created!"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  itemIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemTitle: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  itemSubtitle: {
    color: "#6B7280",
    fontSize: 12,
  },
});


