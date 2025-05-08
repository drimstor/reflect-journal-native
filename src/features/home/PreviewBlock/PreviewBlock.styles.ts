import { StyleSheet } from "react-native";
import { ThemeColors } from "@/src/shared/model/types";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    globalBox: {
      padding: 24,
      paddingVertical: 20,
      backgroundColor: colors.secondary,
      borderRadius: 18,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.alternate,
      overflow: "hidden",
    },
    infoTableBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    titleBox: {
      marginBottom: 12,
      minHeight: 26,
    },
    subTitleBox: {
      marginTop: -4,
      marginBottom: 12,
    },
    tags: {
      gap: 8,
    },
    tagsBox: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    bookmarkedIconBox: {
      position: "absolute",
      top: -4,
      left: 22,
    },
    progressBarBox: {
      marginBottom: 10,
      gap: 8,
    },
    backgroundIconBox: {
      position: "absolute",
      opacity: 0.05,
    },
    Journals: {
      bottom: -70,
      right: -60,
    },
    Chats: {
      bottom: -40,
      right: -20,
    },
    Goals: {
      bottom: -55,
      right: -30,
    },
    Summaries: {
      bottom: -50,
      right: -40,
    },
    JournalEntries: {
      bottom: -70,
      right: -60,
    },
    Charts: {
      bottom: -95,
      right: -60,
      transform: [{ rotate: "-28deg" }],
    },
    Timeline: {
      bottom: -40,
      right: -40,
      transform: [{ scaleY: 0.6 }],
    },
    RelationshipMap: {
      bottom: -70,
      right: -35,
    },
  });
