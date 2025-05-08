import React from "react";
import { ScrollView, View } from "react-native";
import { createStyles } from "./CreateEntityScreen.styles";
import { Divider, BottomSheetScreenHeader } from "@/src/shared/ui";
import { useThemeStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";

// Импорт хука состояния
import { useCreateScreenState } from "./lib/hooks/useCreateScreenState";

// Импорт подкомпонентов
import { FormContainer } from "./ui/FormContainer/FormContainer";
import { ItemCarousel } from "@/src/widgets";
const CreateEntityScreen = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  // Используем хук для управления состоянием экрана
  const {
    date,
    isBookmarked,
    setIsBookmarked,
    currentEntity,
    setCurrentEntity,
    mockData,
    cachedJournalsDataTransformed,
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
  } = useCreateScreenState();

  return (
    <View style={styles.globalBox}>
      {/* Заголовок с кнопками */}
      <BottomSheetScreenHeader
        date={date}
        isBookmarked={isBookmarked}
        toggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onSave={handleSubmit}
        isLoading={isLoading}
        colors={colors}
        doneText={t("shared.actions.done")}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.globalContentBox}
      >
        {/* Карусель выбора типа сущности */}
        <ItemCarousel
          title={t("addEntry.chooseType")}
          data={mockData}
          onSelectItem={(index) => {
            setCurrentEntity(mockData[index].entity_type);
          }}
          modeConfig={entityCarouselConfig}
          colors={colors}
          willCreate={true}
        />

        <Divider color={colors.alternate} />

        {/* Карусель выбора журнала (только для записей в журнале) */}
        {currentEntity === "JournalEntries" && (
          <ItemCarousel
            title={t("addEntry.chooseJournal")}
            data={cachedJournalsDataTransformed}
            onSelectItem={(index) => {
              if (
                cachedJournalsDataTransformed &&
                cachedJournalsDataTransformed[index]
              ) {
                setSelectedJournalId(cachedJournalsDataTransformed[index].id);
              }
            }}
            modeConfig={journalsCarouselConfig}
            colors={colors}
            style={{ marginBottom: 22 }} // Увеличенный отступ для журналов
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
    </View>
  );
};

export default CreateEntityScreen;
