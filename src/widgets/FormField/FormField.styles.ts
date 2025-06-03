import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  toggle: {
    borderWidth: 0.5,
    borderRadius: 16,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  moodContainer: {
    marginVertical: 8,
  },
  moodLabel: {
    marginBottom: 10,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
