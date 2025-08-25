import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggle: {
    borderWidth: 0.5,
    borderRadius: 16,
  },
  label: {
    flex: 1,
    marginRight: 12,
  },
  disabledLabel: {
    opacity: 0.5,
  },
});
