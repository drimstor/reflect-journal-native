import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  headerTextBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    flexShrink: 1,
  },
  headerIconBox: {
    width: 55,
    height: 55,
  },
  headerTitle: {
    textAlign: "center",
  },
  headerSubtitle: {
    textAlign: "center",
  },
  headerLogo: {
    width: 180,
    height: 100,
  },
});
