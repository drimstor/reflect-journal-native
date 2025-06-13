import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  globalBox: {
    paddingTop: 15,
  },
  globalViewHorizontal: {
    paddingBottom: 220,
    gap: 10,
  },
  titleBox: {
    marginTop: 16,
    marginBottom: 8,
  },
  titleBoxWithButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  previewBox: {
    gap: 10,
  },
  chipScrollViewHorizontal: {
    gap: 6,
  },
  shortPreviewScrollViewHorizontal: {
    gap: 10,
  },
  shortPreviewScrollViewHorizontalBox: {},
  chipScrollViewHorizontalBox: {
    height: 44,
  },
  arrowLeftIconBox: {
    transform: [{ rotate: "180deg" }],
  },
});
