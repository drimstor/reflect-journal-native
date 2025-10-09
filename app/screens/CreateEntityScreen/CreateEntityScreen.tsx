import {
  useImagePickerWithActions,
  useKeyboardAnimateAction,
  useT,
} from "@/src/shared/lib/hooks";
import {
  selectSnackbars,
  useAppSelector,
  useBottomSheetStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  AnimatedLoader,
  AudioRecorderContainer,
  BottomSheet,
  BottomSheetList,
  BottomSheetScreenHeader,
  Divider,
  PaddingLayout,
  Text,
  useAnimatedLoading,
} from "@/src/shared/ui";
import { ImagePreview } from "@/src/shared/ui/ImagePreview/ImagePreview";
import { Platform, ScrollView, View } from "react-native";
import { createStyles } from "./CreateEntityScreen.styles";

// Импорт хуков
import { useCreateScreenState } from "./lib/hooks/useCreateScreenState";

// Импорт подкомпонентов
import CreateGoalView from "@/src/features/bottom-sheet-content/CreateGoalView/CreateGoalView";
import CreateSummaryView from "@/src/features/bottom-sheet-content/CreateSummaryView/CreateSummaryView";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { EntityType } from "@/src/shared/model/types";
import { ItemCarousel } from "@/src/widgets";
import { useNavigation } from "@react-navigation/native";
import DatePickerEntityView from "../../../src/features/bottom-sheet-content/DatePickerEntityView/DatePickerEntityView";
import Snackbar from "../../../src/shared/ui/Snackbar/Snackbar";
import { FormContainer } from "./ui/FormContainer/FormContainer";

const CreateEntityScreen = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const styles = createStyles(colors);
  const navigation = useNavigation();
  const snackbars = useAppSelector(selectSnackbars);

  // Используем хук для управления состоянием экрана
  const {
    isBookmarked,
    setIsBookmarked,
    currentEntity,
    setCurrentEntity,
    mockData,
    currentEntityIndex,
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
    handleDateClickForJournalEntries,
    handleDateClickForSummaries,
    handleDateSelected,
    bottomSheetRef,
    snapToIndex,
    snapPoints,
    setSnapPoints,
    closeBottomSheet,
  } = useCreateScreenState(() => selectedImages);

  const {
    selectedImages,
    removeImage,
    isLoading: isImageLoading,
    handleImagePicker,
  } = useImagePickerWithActions({
    allowsMultipleSelection: true,
    selectionLimit: 5,
    quality: 0.8,
    allowsEditing: false,
    onCloseBottomSheet: closeBottomSheet,
    onOpenBottomSheet: () => {
      setSnapPoints([160]);
      requestAnimationFrame(() => {
        snapToIndex(0);
      });
    },
  });

  const { isKeyboardVisibleDelayed, keyboardHeight } = useKeyboardAnimateAction(
    { scrollViewRef }
  );

  const isJournalEntry = currentEntity === ENTITY_NAME.JOURNAL_ENTRIES;

  // Обработчик результата распознавания речи
  const handleSpeechRecognized = (text: string) => {
    if (text && isJournalEntry) {
      const currentContent = values.content || "";
      const newContent = currentContent ? `${currentContent} ${text}` : text;
      handleChange("content", newContent);
    }
  };

  const { currentFlow, currentScreen, resetFlow } = useBottomSheetStore();

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
        isBackButton={Platform.OS === "android"}
        onBack={navigation.goBack}
        date={formattedDate}
        isBookmarked={isBookmarked}
        toggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onSave={handleSubmit}
        isLoading={isLoading || isImageLoading}
        colors={colors}
        doneText={t("shared.actions.create")}
        showDatePicker={isJournalEntry}
        onDateClick={handleDateClickForJournalEntries}
        isDisabled={isJournalEntry && !journalsDataTransformed?.length}
        showDoneButton={
          ![ENTITY_NAME.GOALS, ENTITY_NAME.SUMMARIES].includes(
            currentEntity as EntityType
          )
        }
      />

      <View style={styles.snackbarsContainer}>
        {snackbars.map((snackbar) => (
          <Snackbar key={snackbar.id} data={snackbar} />
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isKeyboardVisibleDelayed ? keyboardHeight : 50,
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
          activeIndex={currentEntityIndex}
          modeConfig={entityCarouselConfig}
          colors={colors}
          willCreate={true}
        />

        <Divider color={colors.alternate} />

        <View style={{ position: "relative" }}>
          <AnimatedLoader
            isVisible={isScreenLoading}
            animatedStyle={animatedStyle}
            backgroundColor={colors.secondary}
            containerStyle={{ minHeight: 1000, paddingTop: 30 }}
          />
        </View>

        {/* Карусель выбора журнала (только для записей в журнале) */}
        {isJournalEntry &&
          (journalsDataTransformed?.length > 0 ? (
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
          ) : (
            <PaddingLayout>
              <Text
                size="base"
                color={colors.contrast}
                style={{ marginVertical: 20, textAlign: "center" }}
              >
                {t("addEntry.noJournals")}
              </Text>
            </PaddingLayout>
          ))}

        {currentEntity === ENTITY_NAME.GOALS && (
          <CreateGoalView
            isStandalone
            isBookmarked={isBookmarked}
            navigationBack={navigation.goBack}
          />
        )}

        {currentEntity === ENTITY_NAME.SUMMARIES && (
          <CreateSummaryView
            isStandalone
            isBookmarked={isBookmarked}
            navigationBack={navigation.goBack}
            dateValue={[values.period_from, values.period_to]}
            onDateClick={handleDateClickForSummaries}
          />
        )}

        {/* Форма для создания сущности */}
        <View
          style={{
            opacity:
              isJournalEntry && !journalsDataTransformed?.length ? 0.3 : 1,
          }}
        >
          <FormContainer
            fields={formConfig.fields}
            values={values}
            errors={errors}
            onChange={handleChange}
            colors={colors}
          />
        </View>

        {/* Секция аудио и изображений (только для записей дневника) */}
        {isJournalEntry && (
          <View
            style={{
              paddingHorizontal: 25,
              paddingBottom: 20,
              gap: 14,
              opacity: !journalsDataTransformed?.length ? 0.3 : 1,
            }}
          >
            <View style={{}}>
              {/* Заголовок */}
              <Text
                size="medium"
                color={colors.contrast}
                style={{ marginBottom: 10 }}
              >
                {t("addEntry.audio.title")}
              </Text>

              {/* Компонент записи аудио */}
              <AudioRecorderContainer
                onSpeechRecognized={handleSpeechRecognized}
              />
            </View>
            <View style={{}}>
              {/* Заголовок */}
              <Text
                size="medium"
                color={colors.contrast}
                style={{ marginBottom: 10 }}
              >
                {t("addEntry.images.title")}
              </Text>

              {/* Кнопка добавления или превью изображений */}
              <ImagePreview
                images={selectedImages}
                onRemove={removeImage}
                showRemoveButton
                onMorePress={handleImagePicker}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        indicatorColor={colors.alternate}
        paddingHorizontal={1}
        initialIndex={-1}
        withBackdrop
        onClose={resetFlow}
      >
        {currentFlow === "common" && currentScreen === "list" ? (
          <BottomSheetList />
        ) : (
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
        )}
      </BottomSheet>
    </View>
  );
};

export default CreateEntityScreen;
