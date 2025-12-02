// Ambient named exports to satisfy TS in the editor environment.
declare module 'react' {
  export function useState<T = any>(initial?: T): [T, (v: any) => void];
  export function useEffect(fn: (...args: any[]) => any, deps?: any[]): void;
  export type RefObject<T> = { current: T | null };
  export function useRef<T = any>(initial?: T): RefObject<T>;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export type ReactNode = any;
  export const Fragment: any;
  export default any;
  export namespace JSX {
    interface IntrinsicElements { [elemName: string]: any }
  }
}

declare module 'react-native' {
  export const Platform: { OS?: string };
  export const View: any;
  export const Text: any;
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const ScrollView: any;
  export const StyleSheet: any;
  export const Alert: any;
  export const KeyboardAvoidingView: any;
  export const ActivityIndicator: any;
  export default any;
}

declare module '@expo/vector-icons' {
  export const Ionicons: any;
  export const FontAwesome: any;
  export default any;
}

declare module 'expo-router' {
  export const Tabs: any;
  export function useRouter(): any;
  export function useLocalSearchParams<T = any>(): T;
  export default any;
}
