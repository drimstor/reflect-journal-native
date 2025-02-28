import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    titleBox: {
      justifyContent: "space-between",
      flexDirection: "row",
      gap: 8,
      marginBottom: 18,
    },
    subTitleBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
      paddingRight: 8,
    },
    infoTableBox: {
      flexDirection: "row",
      gap: 8,
      paddingVertical: 4,
    },
    titleText: {
      marginBottom: 10,
      justifyContent: "center",
    },
    globalViewHorizontal: {
      // paddingTop: 16,
      paddingBottom: 230,
      gap: 10,
      // borderWidth: 1,
      // borderColor: "red",
      // height: 720,
      // height: "100%",
    },
    previewBox: {
      paddingTop: 16,
      paddingBottom: 230,
      gap: 20,
    },
    listItemPreviewBox: {
      gap: 8,
    },
    bigGap: {
      gap: 20,
    },
    divider: {
      marginVertical: 24,
    },
    filtersPanel: {
      paddingBottom: 18,
    },
    animatedView: {
      // opacity: 0,
    },
    pullIcon: {
      position: "absolute",
      top: -10,
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 1000,
    },
  });
