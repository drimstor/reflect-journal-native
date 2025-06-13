import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  globalBox: {
    paddingTop: 15,
  },
  titleBoxWithButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  shortPreviewScrollViewHorizontal: {
    gap: 10,
  },
  arrowLeftIconBox: {
    transform: [{ rotate: "180deg" }],
  },
});
