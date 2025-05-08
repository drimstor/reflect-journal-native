import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  filtersPanel: {
    padding: 24,
    paddingBottom: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedNode: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: "red",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "white",
  },
});
