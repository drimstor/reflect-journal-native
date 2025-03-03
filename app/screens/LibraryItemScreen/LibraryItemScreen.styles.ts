import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";
import { Animated } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    titleBox: {
      justifyContent: "space-between",
      alignItems: "center",
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
      flexWrap: "wrap",
      gap: 8,
      rowGap: 18,
      paddingVertical: 4,
    },
    infoTableItem: {
      width: "48%",
      flexGrow: 1,
      flexShrink: 0,
    },
    titleText: {
      marginBottom: 10,
      marginRight: 8,
    },
    tagsBox: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 6,
    },
    globalViewHorizontal: {
      paddingBottom: 80,
    },
    carouselBox: {
      // width: "0%",
    },
    carousel: {
      // borderWidth: 1,
      // borderColor: "red",
    },
    contentText: {
      fontSize: 16,
    },
    divider: {
      marginVertical: 24,
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
