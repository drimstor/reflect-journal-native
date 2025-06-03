import React from "react";
import { Pressable, View } from "react-native";
import { ArrowLeftIcon, BookmarkCheckIcon, Text } from "@/src/shared/ui";
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
  showDatePicker?: boolean;
  onDateClick?: () => void;
  showDoneButton?: boolean;
}

export const BottomSheetScreenHeader = ({
  date,
  isBookmarked,
  toggleBookmark,
  onSave,
  isLoading,
  colors,
  doneText,
  showDatePicker,
  onDateClick,
  showDoneButton,
}: HeaderProps) => {
  const styles = headerStyles(colors);

  // Обработчик нажатия на дату
  const handleDateClick = () => {
    // Если нельзя выбирать дату или не передан обработчик, не делаем ничего
    if (!showDatePicker || !onDateClick) return;

    // Вызываем переданный обработчик клика по дате
    onDateClick();
  };

  return (
    <View style={styles.headerBox}>
      <Pressable style={styles.pressableLeftBox} onPress={toggleBookmark}>
        <BookmarkCheckIcon
          size={22}
          color={colors.contrast}
          fill={isBookmarked}
        />
      </Pressable>
      <Pressable onPress={handleDateClick}>
        <Text font="bold" size="normal" color={colors.contrast}>
          {date}
          {showDatePicker && (
            <View style={styles.arrowBox}>
              <ArrowLeftIcon size={12} color={colors.contrast} />
            </View>
          )}
        </Text>
      </Pressable>
      <Pressable
        style={styles.pressableRightBox}
        onPress={onSave}
        disabled={isLoading}
      >
        {showDoneButton &&
          (isLoading ? (
            <View style={styles.buttonLoaderBox}>
              <SmallLoader color={colors.contrast} />
            </View>
          ) : (
            <Text font="bold" size="normal" color={colors.contrast}>
              {doneText}
            </Text>
          ))}
      </Pressable>
    </View>
  );
};
