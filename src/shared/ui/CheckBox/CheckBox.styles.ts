import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  checkBoxWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  unchecked: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkBoxIcon: {
    margin: -3,
  },
  checkboxList: {
    paddingVertical: 14,
    flexDirection: "column",
    gap: 12,
    width: "100%",
    paddingRight: 33,
  },
});
