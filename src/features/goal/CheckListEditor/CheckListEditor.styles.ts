import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemContainer: {
    paddingVertical: 4,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    gap: 10,
    // alignItems: "center",
    paddingVertical: 4,
  },
  emptyText: {
    marginVertical: 8,
  },
  addButton: {
    marginTop: 6,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
