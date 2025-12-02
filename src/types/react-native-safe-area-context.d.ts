declare module 'react-native-safe-area-context' {
  import * as React from 'react';

  export type EdgeInsets = {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  export function useSafeAreaInsets(): EdgeInsets;

  export const SafeAreaProvider: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;
  export const initialWindowMetrics: { frame: any; insets: EdgeInsets } | null;

  const _default: {
    useSafeAreaInsets: typeof useSafeAreaInsets;
    SafeAreaProvider: typeof SafeAreaProvider;
    SafeAreaView: typeof SafeAreaView;
    initialWindowMetrics: typeof initialWindowMetrics;
  };

  export default _default as any;
}
declare module 'react-native-safe-area-context' {
  export function useSafeAreaInsets(): { top: number; bottom: number; left: number; right: number };
  export const SafeAreaProvider: any;
  export const SafeAreaView: any;
  export const initialWindowMetrics: any;
}
