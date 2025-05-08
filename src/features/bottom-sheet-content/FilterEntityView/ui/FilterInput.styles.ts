import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    minWidth: "100%",
    paddingRight: 35,
    marginLeft: -7,
  },
  input: {
    maxWidth: "92%",
    fontSize: 16,
  },
  clearButton: {
    transform: [{ rotate: "45deg" }],
    margin: -15,
    marginRight: -5,
  },
});
