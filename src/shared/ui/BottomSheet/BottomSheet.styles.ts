import { PALLETE_COLORS } from "@/src/shared/const";
import { StyleSheet } from "react-native";

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
