// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    plugins: {
      "react-compiler": require("eslint-plugin-react-compiler"),
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
]);
