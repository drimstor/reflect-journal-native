import { StyleSheet } from "react-native";
import { ThemeColors } from "../../model/types";

export const styles = StyleSheet.create({
  bottomSheetBox: {
    flex: 1,
    zIndex: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  bottomSheet: {
    borderRadius: 30,
    overflow: "hidden",
    zIndex: -1,
    bottom: 0,
    position: "absolute",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
});

export const createStaticBackdropStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bottomSheetStaticBackdrop: {
      position: "absolute",
      top: 85,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.secondary,
      borderColor: colors.alternate,
      borderWidth: 1,
      borderRadius: 24,
    },
  });
