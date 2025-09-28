import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  globalBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    zIndex: 0,
  },
  counterBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexShrink: 1,
    width: "100%",
    position: "relative",
  },
  counter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  counterTitle: {
    lineHeight: 15,
  },
  counterText: {
    textAlign: "center",
    lineHeight: 16,
  },
  progressLine: {
    position: "absolute",
    top: 12,
    left: "50%",
    width: "100%",
    height: 2,
  },
});
