import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  chip: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minWidth: 40,
    paddingBottom: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  small: {
    height: 18,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  medium: {
    height: 26,
    paddingHorizontal: 8,
  },
  base: {
    height: 34,
    paddingHorizontal: 18,
  },
});
