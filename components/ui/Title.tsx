import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
}

// Title component that positions itself next to the BackButton
export const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10, // Space between back button and title
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
});