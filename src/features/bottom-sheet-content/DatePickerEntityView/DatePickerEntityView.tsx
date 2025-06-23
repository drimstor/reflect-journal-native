import { FONTS } from "@/src/shared/const";
import { useLang, useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useFiltersStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  PaddingLayout,
  Text,
} from "@/src/shared/ui";
import React from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { createStyles } from "./DatePickerEntityView.styles";
import { initCalendarLocales } from "./const/static";
import { useCalendarLocalization, useDateSelection } from "./lib/hooks";
import { formatFromISODate } from "./lib/utils";

// Инициализация локализации календаря
initCalendarLocales();

interface DatePickerEntityViewProps {
  mode?: "single" | "period";
  showHeader?: boolean;
  showResetButton?: boolean;
  onDateSelected?: (dates: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  dateVariant?: "created_at" | "updated_at";
  isWithoutHeaderControls?: boolean;
}

const DatePickerEntityView: React.FC<DatePickerEntityViewProps> = ({
  mode = "period",
  showHeader = true,
  showResetButton = true,
  onDateSelected,
  initialStartDate,
  initialEndDate,
  dateVariant = "created_at",
  isWithoutHeaderControls = false,
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { navigateToFlow, flowData, setBottomSheetVisible } =
    useBottomSheetStore();
  const styles = createStyles(colors);
  const { locale } = useLang();
  useCalendarLocalization(locale);

  if (flowData.sort_field) dateVariant = flowData.sort_field;

  const {
    onDateSelected: onDateSelectedFromFlow,
    title,
    onBack,
    startDate: startDateFromFlow,
    endDate: endDateFromFlow,
  } = flowData.datePickerProps || {};

  if (onDateSelectedFromFlow) onDateSelected = onDateSelectedFromFlow;
  if (startDateFromFlow) initialStartDate = startDateFromFlow;
  if (endDateFromFlow) initialEndDate = endDateFromFlow;

  const {
    created_at_from,
    created_at_to,
    updated_at_from,
    updated_at_to,
    setCreatedAtRange,
    setUpdatedAtRange,
  } = useFiltersStore();

  // Определяем начальные значения
  const defaultStartDate =
    initialStartDate ||
    (dateVariant === "created_at" ? created_at_from : updated_at_from);

  const defaultEndDate =
    initialEndDate ||
    (dateVariant === "created_at" ? created_at_to : updated_at_to);

  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    mode === "single"
      ? defaultStartDate
        ? defaultStartDate.split("T")[0]
        : new Date().toISOString().split("T")[0]
      : null
  );

  // Используем хук для управления выбором дат в режиме period
  const {
    startDate,
    endDate,
    markedDates: periodMarkedDates,
    handleDayPress: handlePeriodDayPress,
    handleReset,
  } = useDateSelection(
    defaultStartDate ? defaultStartDate.split("T")[0] : null,
    defaultEndDate ? defaultEndDate.split("T")[0] : null,
    colors.primary,
    colors.white,
    colors.contrast
  );

  // Формируем объект с отмеченной датой для режима single
  const singleMarkedDates: MarkedDates = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: colors.primary,
        },
      }
    : {};

  // Обработчик выбора даты в режиме single
  const handleSingleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // Обработчик применения выбранных дат
  const handleApply = () => {
    if (mode === "single") {
      if (onDateSelected) {
        onDateSelected({ startDate: selectedDate, endDate: null });
      }
    } else {
      // Форматируем даты в ISO формат для режима period
      const startISODate = startDate ? `${startDate}T00:00:00Z` : undefined;
      const endISODate = endDate ? `${endDate}T23:59:59Z` : undefined;

      // Обновляем значения в сторе в зависимости от типа даты (если используем внутренний стор)
      if (!onDateSelected) {
        if (dateVariant === "created_at") {
          setCreatedAtRange(startISODate, endISODate);
        } else {
          setUpdatedAtRange(startISODate, endISODate);
        }

        setBottomSheetVisible(false);
      } else {
        // Используем коллбэк для внешнего управления
        onDateSelected({
          startDate: startDate,
          endDate: endDate,
        });
      }
    }

    // Если нет внешнего обработчика, закрываем bottom sheet
    if (!onDateSelected) {
      setBottomSheetVisible(false);
    }
  };

  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else {
      navigateToFlow("date", "list");
    }
  };

  const handleCloseAction = () => {
    setBottomSheetVisible(false);
  };

  // Используем правильные значения и обработчики в зависимости от режима
  const currentMarkedDates =
    mode === "single" ? singleMarkedDates : periodMarkedDates;
  const handleDayPress =
    mode === "single" ? handleSingleDayPress : handlePeriodDayPress;
  const markingType = mode === "single" ? "dot" : "period";

  // Формируем текст для отображения выбранных дат
  const dateDisplayText = () => {
    if (mode === "single") {
      return selectedDate
        ? formatFromISODate(selectedDate)
        : t("date.picker.placeholder");
    } else {
      return `${
        startDate ? formatFromISODate(startDate) : t("date.picker.placeholder")
      }${
        endDate
          ? ` - ${formatFromISODate(endDate)}`
          : startDate
          ? ` - ${t("date.untilToday")}`
          : ""
      }`;
    }
  };

  // Определяем, активна ли кнопка сброса
  const isResetEnabled = mode === "single" ? !!selectedDate : !!startDate;

  return (
    <BottomSheetBox>
      {showHeader && (
        <BottomSheetHeader
          title={
            title ||
            (dateVariant === "created_at"
              ? t("date.byCreated")
              : t("date.byUpdated"))
          }
          onClose={isWithoutHeaderControls ? undefined : handleCloseAction}
          onBack={isWithoutHeaderControls ? undefined : handleBackAction}
        />
      )}

      <PaddingLayout style={!showHeader ? { paddingTop: 14 } : undefined}>
        <View style={styles.dateRangeContainer}>
          <Text style={[styles.dateRangeText, { color: colors.contrast }]}>
            {dateDisplayText()}
          </Text>
        </View>

        <View style={{ minHeight: 365 }}>
          <Calendar
            onDayPress={handleDayPress}
            markingType={markingType}
            markedDates={currentMarkedDates}
            monthFormat="MMMM yyyy"
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
        {showResetButton && (
          <Button
            backgroundColor={colors.alternate}
            onPress={
              mode === "single" ? () => setSelectedDate(null) : handleReset
            }
            disabled={!isResetEnabled}
          >
            {t("shared.actions.reset")}
          </Button>
        )}
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
