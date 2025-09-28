module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [
      ["babel-plugin-react-compiler", require("./react-compiler.config.js")], // React Compiler - автоматическая мемоизация
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          alias: {
            "@": ".",
          },
        },
      ],
    ],
  };
};
