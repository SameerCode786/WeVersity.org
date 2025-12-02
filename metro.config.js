const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Some packages (for example @react-native-async-storage/async-storage)
// use the `react-native` field in their package.json that points to
// TypeScript source (`src/index.ts`). Metro may fail to resolve/transform
// those files in node_modules. Prefer the compiled `main` field for
// such packages by preferring `main` in resolverMainFields, and ensure
// ts/tsx extensions are included in resolution.
config.resolver = config.resolver || {};
config.resolver.resolverMainFields = ['main', 'module', 'react-native'];
config.resolver.sourceExts = Array.from(new Set([...(config.resolver.sourceExts || []), 'cjs', 'ts', 'tsx']));

module.exports = config;