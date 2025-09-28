import { ThemeColors } from "@/src/shared/model/types";
import { ArrowLeftIcon, BookmarkCheckIcon, Text } from "@/src/shared/ui";
import { SmallLoader } from "@/src/shared/ui/Loader/SmallLoader";
import React from "react";
import { Pressable, View } from "react-native";
import { useT } from "../../lib/hooks";
import { headerStyles } from "./BottomSheetScreenHeader.styles";

interface HeaderProps {
  date: string;
  isBookmarked: boolean;
  isBackButton: boolean;
  toggleBookmark: () => void;
  onSave: () => void;
  isLoading: boolean;
  colors: ThemeColors;
  doneText: string;
  showDatePicker?: boolean;
  onDateClick?: () => void;
  showDoneButton?: boolean;
  onBack?: () => void;
  isDisabled?: boolean;
}

export const BottomSheetScreenHeader = ({
  date,
  isBookmarked,
  isBackButton,
  toggleBookmark,
  onSave,
  isLoading,
  colors,
  doneText,
  showDatePicker,
  onDateClick,
  showDoneButton,
  onBack,
  isDisabled,
}: HeaderProps) => {
  const styles = headerStyles(colors);
  const t = useT();

  // Обработчик нажатия на дату
  const handleDateClick = () => {
    // Если нельзя выбирать дату или не передан обработчик, не делаем ничего
    if (!showDatePicker || !onDateClick) return;

    // Вызываем переданный обработчик клика по дате
    onDateClick();
  };

  return (
    <View style={styles.headerBox}>
      {isBackButton && (
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text font="bold" size="normal" color={colors.contrast}>
            {t("shared.actions.back")}
          </Text>
        </Pressable>
      )}
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
        disabled={isLoading || isDisabled}
      >
        {showDoneButton &&
          (isLoading ? (
            <View style={styles.buttonLoaderBox}>
              <SmallLoader color={colors.contrast} />
            </View>
          ) : (
            <Text
              font="bold"
              size="normal"
              color={colors.contrast}
              withOpacity={isDisabled ? 60 : undefined}
            >
              {doneText}
            </Text>
          ))}
      </Pressable>
    </View>
  );
};
