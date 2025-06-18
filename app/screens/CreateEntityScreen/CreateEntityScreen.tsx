import React from "react";
import { ScrollView, View } from "react-native";
import { createStyles } from "./CreateEntityScreen.styles";
import {
  Divider,
  BottomSheetScreenHeader,
  BottomSheet,
  useAnimatedLoading,
  AnimatedLoader,
} from "@/src/shared/ui";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { useT, useKeyboardAnimateAction } from "@/src/shared/lib/hooks";

// Импорт хука состояния
import { useCreateScreenState } from "./lib/hooks/useCreateScreenState";

// Импорт подкомпонентов
import { FormContainer } from "./ui/FormContainer/FormContainer";
import { ItemCarousel } from "@/src/widgets";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import DatePickerEntityView from "@/src/features/bottom-sheet-content/DatePickerEntityView/DatePickerEntityView";
import CreateGoalView from "@/src/features/bottom-sheet-content/CreateGoalView/CreateGoalView";
import { useNavigation } from "@react-navigation/native";
import CreateSummaryView from "@/src/features/bottom-sheet-content/CreateSummaryView/CreateSummaryView";
import { EntityType } from "@/src/shared/model/types";

const CreateEntityScreen = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const { window } = useDeviceStore();

  // Используем хук для управления состоянием экрана
  const {
    isBookmarked,
    setIsBookmarked,
    currentEntity,
    setCurrentEntity,
    mockData,
    journalsDataTransformed,
    setSelectedJournalId,
    entityCarouselConfig,
    journalsCarouselConfig,
    scrollViewRef,
    formConfig,
    isLoading,
    values,
    errors,
    handleChange,
    handleSubmit,
    formattedDate,
    handleDateClick,
    handleDateSelected,
    bottomSheetRef,
  } = useCreateScreenState();

  const { isKeyboardVisibleDelayed } = useKeyboardAnimateAction({
    scrollViewRef,
  });

  const isJournalEntry = currentEntity === ENTITY_NAME.JOURNAL_ENTRY;

  // Используем хук для анимированного лоадера экрана
  const {
    isLoading: isScreenLoading,
    startLoading: handleScreenLoading,
    animatedStyle,
  } = useAnimatedLoading();

  return (
    <View style={styles.globalBox}>
      {/* Заголовок с кнопками */}
      <BottomSheetScreenHeader
        date={formattedDate}
        isBookmarked={isBookmarked}
        toggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onSave={handleSubmit}
        isLoading={isLoading}
        colors={colors}
        doneText={t("shared.actions.done")}
        showDatePicker={isJournalEntry}
        onDateClick={handleDateClick}
        showDoneButton={
          ![ENTITY_NAME.GOAL, ENTITY_NAME.SUMMARY].includes(
            currentEntity as EntityType
          )
        }
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isKeyboardVisibleDelayed ? 370 : 50,
        }}
      >
        {/* Карусель выбора типа сущности */}
        <ItemCarousel
          title={t("addEntry.choose.type")}
          data={mockData}
          onSelectItem={(index) => {
            setCurrentEntity(mockData[index].entity_type);
            handleScreenLoading();
          }}
          modeConfig={entityCarouselConfig}
          colors={colors}
          willCreate={true}
        />

        <Divider color={colors.alternate} />

        <View style={{ position: "relative" }}>
          <AnimatedLoader
            isVisible={isScreenLoading}
            animatedStyle={animatedStyle}
            size={window.width - 100}
            backgroundColor={colors.secondary}
            containerStyle={{ minHeight: 1000, paddingTop: 30 }}
          />
        </View>

        {/* Карусель выбора журнала (только для записей в журнале) */}
        {isJournalEntry && (
          <ItemCarousel
            title={t("addEntry.choose.journals")}
            data={journalsDataTransformed}
            onSelectItem={(index) => {
              if (journalsDataTransformed && journalsDataTransformed[index]) {
                setSelectedJournalId(journalsDataTransformed[index].id);
              }
            }}
            modeConfig={journalsCarouselConfig}
            colors={colors}
            style={{ marginBottom: 22 }} // Увеличенный отступ для журналов
          />
        )}

        {currentEntity === ENTITY_NAME.GOAL && (
          <CreateGoalView
            isStandalone
            isBookmarked={isBookmarked}
            navigationBack={navigation.goBack}
          />
        )}

        {currentEntity === ENTITY_NAME.SUMMARY && (
          <CreateSummaryView
            isStandalone
            isBookmarked={isBookmarked}
            navigationBack={navigation.goBack}
            dateValue={[values.period_from, values.period_to]}
            onDateClick={handleDateClick}
          />
        )}

        {/* Форма для создания сущности */}
        <FormContainer
          fields={formConfig.fields}
          values={values}
          errors={errors}
          onChange={handleChange}
          colors={colors}
        />
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[isJournalEntry ? 580 : 650]}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        indicatorColor={colors.alternate}
        paddingHorizontal={1}
        initialIndex={-1}
        withBackdrop
      >
        <DatePickerEntityView
          mode={isJournalEntry ? "single" : "period"}
          showHeader={false}
          showResetButton={!isJournalEntry}
          onDateSelected={(dates) => {
            const { startDate, endDate } = dates;

            if (isJournalEntry) {
              return handleDateSelected("created_at")(startDate);
            }

            handleDateSelected("period_from")(startDate);
            handleDateSelected("period_to")(endDate);
          }}
        />
      </BottomSheet>
    </View>
  );
};

export default CreateEntityScreen;
