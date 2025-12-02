import 'expo-router/entry';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
// Use runtime require to avoid type issues with LogBox in some RN versions
const RN = require('react-native');

export default function App() {
  // Show runtime logs for debugging; suppress known non-actionable warnings
  useEffect(() => {
    RN.LogBox?.ignoreLogs?.(['Setting a timer']);
  }, []);

  // Hide status bar entirely
  return <StatusBar hidden />;
}
