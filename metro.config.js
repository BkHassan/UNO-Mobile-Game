const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('png');

module.exports = defaultConfig;

// const { getDefaultConfig } = require("expo/metro-config");

// module.exports = (async () => {
//   const config = await getDefaultConfig(__dirname);
//   return {
//     ...config,
//     resolver: {
//       ...config.resolver,
//       sourceExts: [...config.resolver.sourceExts, "js", "jsx", "ts", "tsx", "cjs"],
//       assetExts: [...config.resolver.assetExts, "png", "jpg", "jpeg"],
//     },
//     transformer: {
//       ...config.transformer,
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: true,
//         },
//       }),
//     },
//   };
// })();