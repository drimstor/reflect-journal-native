import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  backButton: {
    transform: [{ rotate: "180deg" }],
  },
  closeButton: {
    transform: [{ rotate: "45deg" }],
  },
  footer: {
    paddingHorizontal: 24,
    gap: 14,
  },
  divider: {
    margin: 0,
  },
  mockBlock: {
    minWidth: 22,
  },
});
