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
    gap: 10,
  },
  headerTextBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  headerLeftIcon: {
    transform: [{ rotate: "180deg" }],
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
