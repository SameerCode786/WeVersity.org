import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, BackButtonProps } from '../buttons/BackButton';
import { Title } from './Title';

interface HeaderProps extends BackButtonProps {
  title: string;
}

// Combined Header component that positions BackButton and Title on the same line
export const Header: React.FC<HeaderProps> = ({ title, ...backButtonProps }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <BackButton {...backButtonProps} />
      <Title>{title}</Title>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 60,
    backgroundColor: '#fff',
    zIndex: 10,
  },
});