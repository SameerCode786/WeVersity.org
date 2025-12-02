// Load .env only if available (prevents errors when node_modules is missing)
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv/config');
} catch (e) {
  // ignore - dotenv may not be installed yet during first `npx expo install`
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'WeVersity.org',
  slug: 'weversity',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'weversityorg',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/icon.png',
      backgroundImage: './assets/images/splash-icon.png',
      monochromeImage: './assets/images/icon.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: 'f1419e6a-d48f-449d-bbef-3f18e4b1be89',
    },
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/f1419e6a-d48f-449d-bbef-3f18e4b1be89',
  },
});