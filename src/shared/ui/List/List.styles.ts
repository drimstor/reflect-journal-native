import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listItemBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    maxHeight: Platform.OS === "android" ? 70 : "auto",
  },
  listItemDefault: {
    justifyContent: "space-between",
  },
  listBox: {
    // flex: 1,s
  },
  elementBox: {
    marginLeft: "auto",
    marginRight: 8,
  },
  iconBox: {
    maxWidth: 24,
  },
});
