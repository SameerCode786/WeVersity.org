// Lightweight shims for editor/TS checks in this workspace.
// These are intentionally permissive - they silence missing module/type errors
// while you run/install dependencies locally. Remove these when you have proper
// @types packages installed and a complete node_modules.

declare module 'react' {
  const React: any;
  export = React;
}

declare module 'react/jsx-runtime' {
  const jsx: any;
  export default jsx;
}

declare module 'react-native' {
  const RN: any;
  export = RN;
}

declare module 'expo-router' {
  const whatever: any;
  export = whatever;
}

declare module '@expo/vector-icons' {
  const whatever: any;
  export = whatever;
}

declare module 'expo-linking' {
  const whatever: any;
  export = whatever;
}

declare module 'react-native-phone-number-input' {
  const whatever: any;
  export default whatever;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any;
  export default AsyncStorage;
}

declare module '@react-navigation/material-top-tabs' {
  const whatever: any;
  export = whatever;
}

declare module '@react-navigation/native' {
  const whatever: any;
  export = whatever;
}

declare module 'react-native-safe-area-context' {
  const whatever: any;
  export = whatever;
}

declare module '@react-navigation/bottom-tabs' {
  const whatever: any;
  export = whatever;
}

declare module '@react-native-community/masked-view' {
  const whatever: any;
  export = whatever;
}

declare module 'react-native-gesture-handler' {
  const whatever: any;
  export = whatever;
}

declare module 'react-native-reanimated' {
  const whatever: any;
  export = whatever;
}

// Generic fallback for any other package the type system can't resolve.
declare module '*';

// Provide a minimal JSX namespace so TSX compiles when React types are missing.
declare namespace JSX {
  interface IntrinsicAttributes { [key: string]: any }
  interface IntrinsicClassAttributes<T> { [key: string]: any }
  interface IntrinsicElements { [elemName: string]: any }
}
