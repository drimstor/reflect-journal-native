import React from "react";
import { Pressable, View } from "react-native";
import { BookmarkCheckIcon, Text } from "@/src/shared/ui";
import { headerStyles } from "./BottomSheetScreenHeader.styles";
import { ThemeColors } from "@/src/shared/model/types";
import { SmallLoader } from "@/src/shared/ui/Loader/SmallLoader";

interface HeaderProps {
  date: string;
  isBookmarked: boolean;
  toggleBookmark: () => void;
  onSave: () => void;
  isLoading: boolean;
  colors: ThemeColors;
  doneText: string;
}

export const BottomSheetScreenHeader = ({
  date,
  isBookmarked,
  toggleBookmark,
  onSave,
  isLoading,
  colors,
  doneText,
}: HeaderProps) => {
  const styles = headerStyles(colors);

  return (
    <View style={styles.headerBox}>
      <Pressable style={styles.pressableLeftBox} onPress={toggleBookmark}>
        <BookmarkCheckIcon
          size={22}
          color={colors.contrast}
          fill={isBookmarked}
        />
      </Pressable>
      <Text font="bold" size="normal" color={colors.contrast}>
        {date}
      </Text>
      <Pressable
        style={styles.pressableRightBox}
        onPress={onSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.buttonLoaderBox}>
            <SmallLoader color={colors.contrast} />
          </View>
        ) : (
          <Text font="bold" size="normal" color={colors.contrast}>
            {doneText}
          </Text>
        )}
      </Pressable>
    </View>
  );
};
