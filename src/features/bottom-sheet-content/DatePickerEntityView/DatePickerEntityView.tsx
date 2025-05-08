import React from "react";
import {
  Text,
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
} from "@/src/shared/ui";
import {
  useThemeStore,
  useBottomSheetStore,
  useFiltersStore,
} from "@/src/shared/store";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { Calendar } from "react-native-calendars";
import { View } from "react-native";
import { createStyles } from "./DatePickerEntityView.styles";
import { initCalendarLocales } from "./const/static";
import { formatFromISODate } from "./lib/utils";
import { useCalendarLocalization, useDateSelection } from "./lib/hooks";
import { FONTS } from "@/src/shared/const";

// Инициализация локализации календаря
initCalendarLocales();

const DatePickerEntityView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { navigateToFlow, flowData, setBottomSheetVisible } =
    useBottomSheetStore();
  const styles = createStyles(colors);
  const { locale } = useLang();
  useCalendarLocalization(locale);
  const dateVariant: "created_at" | "updated_at" = flowData.sort_field;

  const isWithoutHeaderControls = flowData.isWithoutHeaderControls;

  const {
    created_at_from,
    created_at_to,
    updated_at_from,
    updated_at_to,
    setCreatedAtRange,
    setUpdatedAtRange,
  } = useFiltersStore();

  // Определяем начальные значения в зависимости от типа даты
  const initialStartDate =
    dateVariant === "created_at"
      ? formatFromISODate(created_at_from)
      : formatFromISODate(updated_at_from);

  const initialEndDate =
    dateVariant === "created_at"
      ? formatFromISODate(created_at_to)
      : formatFromISODate(updated_at_to);

  // Используем хук для управления выбором дат
  const { startDate, endDate, markedDates, handleDayPress, handleReset } =
    useDateSelection(
      initialStartDate,
      initialEndDate,
      colors.primary,
      colors.white,
      colors.contrast
    );

  // Обработчик применения выбранных дат
  const handleApply = () => {
    // Форматируем даты в ISO формат
    const startISODate = startDate ? `${startDate}T00:00:00Z` : undefined;
    const endISODate = endDate ? `${endDate}T23:59:59Z` : undefined;

    // Обновляем значения в сторе в зависимости от типа даты
    if (dateVariant === "created_at") {
      setCreatedAtRange(startISODate, endISODate);
    } else {
      setUpdatedAtRange(startISODate, endISODate);
    }

    // Возвращаемся к предыдущему экрану
    setBottomSheetVisible(false);
  };

  const handleBack = () => {
    navigateToFlow("date", "list");
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={
          dateVariant === "created_at"
            ? t("date.byCreated")
            : t("date.byUpdated")
        }
        onClose={isWithoutHeaderControls ? undefined : handleBack}
        onBack={isWithoutHeaderControls ? undefined : handleBack}
      />
      <PaddingLayout>
        <View style={styles.dateRangeContainer}>
          <Text style={[styles.dateRangeText, { color: colors.contrast }]}>
            {startDate
              ? formatFromISODate(startDate)
              : t("date.picker.placeholder")}
            {endDate ? ` - ${formatFromISODate(endDate)}` : ""}
          </Text>
        </View>

        <View style={{ minHeight: 365 }}>
          <Calendar
            onDayPress={handleDayPress}
            markingType={"period"}
            markedDates={markedDates}
            theme={{
              calendarBackground: "transparent",
              todayTextColor: colors.accent,
              arrowColor: colors.contrast,
              monthTextColor: colors.contrast,
              dayTextColor: colors.contrast,
              textDisabledColor:
                theme === "light" ? colors.primary + 50 : colors.white + 50,
              textSectionTitleColor: colors.contrast,

              textDayFontFamily: FONTS.regular,
              textMonthFontFamily: FONTS.regular,
              textDayHeaderFontFamily: FONTS.regular,
            }}
          />
        </View>
      </PaddingLayout>
      <BottomSheetFooter>
        <Button
          backgroundColor={colors.alternate}
          onPress={handleReset}
          disabled={!startDate}
        >
          {t("shared.actions.reset")}
        </Button>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          onPress={handleApply}
        >
          {t("shared.actions.apply")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default DatePickerEntityView;
