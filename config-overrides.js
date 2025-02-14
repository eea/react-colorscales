const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config) {
  config.plugins = [...config.plugins, new NodePolyfillPlugin()];

  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    (warning) =>
      warning.message.includes("Failed to parse source map") &&
      warning.message.includes("mapbox-gl-unminified.js.map"),
  ];

  return config;
};
