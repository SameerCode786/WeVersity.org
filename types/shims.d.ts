declare module 'react' {
  const React: any;
  export default React;
  export const useEffect: any;
  export function useState<T = any>(initial?: T): [T, (v: T | ((prev: T) => T)) => void];
  export const useMemo: any;
  export type FC<P = any> = any;
  export function createContext<T = any>(value: T): T;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const Image: any;
  export const FlatList: any;
  export const SafeAreaView: any;
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const Pressable: any;
  export const StyleSheet: any;
  export const Dimensions: any;
  export const Modal: any;
  export const RefreshControl: any;
  export const ScrollView: any;
  export const Platform: any;
  export const Animated: any;
  export const useWindowDimensions: any;
}

declare module 'expo-router' {
  export const Stack: any;
  export const Tabs: any;
  export const useRouter: any;
  export const useLocalSearchParams: any;
  export const withLayoutContext: any;
  const _default: any;
  export default _default;
}

declare module '@supabase/supabase-js' {
  export type Session = any;
  export type User = any;
  export type AuthChangeEvent = any;
  export type PostgrestError = any;
  export const createClient: any;
}

declare module '@react-navigation/material-top-tabs' {
  export function createMaterialTopTabNavigator(): any;
}
