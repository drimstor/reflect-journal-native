import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainChartTitle: {
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  arrowIcon: {
    transform: [{ rotate: "-90deg" }, { translateX: -2 }],
  },
  subChartTitle: {
    textAlign: "center",
    marginBottom: 25,
  },
});
