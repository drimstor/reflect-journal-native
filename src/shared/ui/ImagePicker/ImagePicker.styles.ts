import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    borderColor: "#CCCCCC",
    backgroundColor: "#F5F5F5",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    color: "#007AFF",
  },
});
