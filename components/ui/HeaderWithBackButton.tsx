import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, BackButtonProps } from '../buttons/BackButton';

interface HeaderWithBackButtonProps extends BackButtonProps {
  title: string;
}

export const HeaderWithBackButton = ({
  title,
  inline,
  onPress
}: HeaderWithBackButtonProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, !inline && { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <BackButton inline onPress={onPress} />
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 60,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10,
    flex: 1,
  },
});