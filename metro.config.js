const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts, 'tflite'],
    sourceExts: [...resolver.sourceExts],
  };


  return config;
})();
