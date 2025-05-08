import { FONTS } from "@/src/shared/const/FONTS";
import { StyleSheet } from "react-native";

export const sizeStyles = StyleSheet.create({
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
  medium: {
    fontSize: 14,
    lineHeight: 18,
  },
  base: {
    fontSize: 15,
    lineHeight: 20,
  },
  normal: {
    fontSize: 16,
    lineHeight: 22,
  },
  large: {
    fontSize: 18,
    lineHeight: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  extraLarge: {
    fontSize: 22,
    lineHeight: 28,
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
  },
});

export const fontStyles = StyleSheet.create({
  regular: {
    fontFamily: FONTS.regular,
  },
  bold: {
    fontFamily: FONTS.bold,
  },
  thin: {
    fontFamily: FONTS.thin,
  },
});

export const textStyles = StyleSheet.create({
  text: {
    flexShrink: 1,
    paddingVertical: 0,
  },
  titleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
});
