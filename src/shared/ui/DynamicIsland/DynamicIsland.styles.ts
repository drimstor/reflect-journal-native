import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  globalBox: {
    position: "absolute",
    top: 11,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: "100%",
    alignItems: "center",
  },
  innerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  textBox: {
    overflow: "hidden",
    maxWidth: "78%",
    position: "absolute",
    top: 13,
    left: 70,
    right: 0,
    bottom: 0,
    height: "100%",
  },
});
