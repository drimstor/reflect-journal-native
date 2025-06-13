import { StyleSheet } from "react-native";

export const createStyles = () =>
  StyleSheet.create({
    titleBox: {
      marginTop: 16,
      marginBottom: 6,
    },
    previewBox: {
      gap: 10,
    },
    chipScrollViewHorizontal: {
      gap: 6,
    },
    chipScrollViewHorizontalBox: {
      height: 44,
    },
    arrowLeftIconBox: {
      transform: [{ rotate: "180deg" }],
    },
  });
