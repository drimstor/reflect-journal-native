import { Journal, useGetAnyEntity, useGetMood } from "@/src/entities";
import { ChecklistItem } from "@/src/entities/goals/model/types";
import { PATHS } from "@/src/shared/const";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import {
  formatDate,
  formatReadingTime,
  getWeekDay,
  stringToColor,
} from "@/src/shared/lib/helpers";
import { useLang, useT } from "@/src/shared/lib/hooks";
import { StackNavigationProps } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  AnimatedAppearance,
  BottomSheet,
  Button,
  CheckBox,
  CheckboxList,
  Chip,
  Divider,
  InfoBox,
  Layout,
  MarkdownEmojiText,
  PaddingLayout,
  Text,
  TitleText,
  useBottomSheetActions,
  useCarouselConfig,
} from "@/src/shared/ui";
import {
  CalendarIcon,
  CheckIcon,
  ClipboardTextIcon,
  DocumentTextIcon,
  DotsIcon,
  TimerIcon,
} from "@/src/shared/ui/icons";
import {
  CommandWidget,
  Header,
  ItemCarousel,
  useHeaderStore,
} from "@/src/widgets";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useChecklistActions } from "./lib/hooks/useChecklistActions";
import { useSetDocumentProgress } from "./lib/hooks/useSetDocumentProgress";
import { createStyles } from "./LibraryItemScreen.styles";

const LibraryItemScreen = () => {
  const t = useT();
  const { locale } = useLang();
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const { subtitle } = useHeaderStore();
  const { setNavigation } = useBottomSheetStore();
  const route = useRoute();
  const { variant, item } = route.params as any;
  const { handlePress } = useBottomSheetActions(variant, item);
  const navigation = useNavigation<StackNavigationProps>();
  const [currentItem, setCurrentItem] = useState<any>(null);
  const mood = useGetMood(currentItem?.mood);
  const { data } = useGetAnyEntity({ type: variant, id: item.id });

  const isJournalEntry = variant === ENTITY_NAME.JOURNAL_ENTRIES;
  const isTest = variant === ENTITY_NAME.TESTS;
  const isTestResult = variant === ENTITY_NAME.TEST_RESULTS;

  useEffect(() => {
    setCurrentItem(data || item);
  }, [item, data]);

  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [variant]);

  // ------------------------------------------------------------ //

  const { data: parentJournal } = useGetAnyEntity({
    type: ENTITY_NAME.JOURNALS,
    id: item.journal_id,
    skip: !isJournalEntry,
  });

  useEffect(() => {
    if (isJournalEntry && data) {
      setCurrentItem({
        ...data,
        related_entities: (parentJournal as Journal)?.related_entities as any,
      });
    }
  }, [(parentJournal as Journal)?.related_entities, data]);

  const carouselConfig = useCarouselConfig(
    25,
    currentItem?.related_entities?.length > 1 ? 60 : 0
  );

  // ------------------------------------------------------------ //

  // const journal = useAppSelector(getJournalCache(currentItem?.journal_id));

  const { checkboxes, isUpdatingChecklistItem, handleCheckboxToggle } =
    useChecklistActions(variant, currentItem?.id, currentItem?.checklist || []);

  const isDocument = variant === ENTITY_NAME.DOCUMENTS;

  // Hook для отслеживания прогресса просмотра документа (только для документов)
  const { progress, handleScroll, isLoading } = isDocument
    ? useSetDocumentProgress({
        documentId: currentItem?.id || "",
        enabled: !!currentItem?.id,
      })
    : {
        progress: 0,
        handleScroll: () => {},
        isLoading: false,
      };

  const handleStartTest = () => {
    navigation.navigate(PATHS.TEST, {
      testId: currentItem?.id,
    });
  };

  const handleTakeTestAgain = () => {
    navigation.navigate(PATHS.TEST, {
      testId: currentItem?.test_id,
    });
  };

  return (
    <Layout>
      <Header
        title={t(
          `entities.${isDocument ? item.type : variant.toLowerCase()}.singular`
        )}
        subtitle={subtitle}
        backButton
        rightIcon={
          isTest
            ? undefined
            : {
                icon: <DotsIcon color={colors.contrast} size={22} />,
                onPress: handlePress,
              }
        }
      />
      <BottomSheet
        snapPoints={[window.height - 85]}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        style={{ paddingTop: 25 }}
        initialIndex={0}
        staticMode
        paddingHorizontal={0}
      >
        <AnimatedAppearance isVisible delay={150}>
          <ScrollView
            contentContainerStyle={styles.globalViewHorizontal}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            style={{ maxHeight: window.height - 160 }}
            onScroll={handleScroll}
          >
            <PaddingLayout>
              {(currentItem?.name || currentItem?.title) && (
                <View style={[styles.titleBox]}>
                  <Text size="extraLarge" font="bold" color={colors.contrast}>
                    {currentItem?.name || currentItem?.title}
                  </Text>
                  {variant !== "JournalEntries" &&
                    currentItem?.related_topics?.[0] && (
                      <Chip
                        color={stringToColor(currentItem?.related_topics?.[0])}
                        title={currentItem?.related_topics?.[0]}
                      />
                    )}
                </View>
              )}
              <View style={styles.infoTableBox}>
                <View style={styles.infoTableItem}>
                  <InfoBox
                    label={t("shared.info.created")}
                    icon={<CalendarIcon color={colors.contrast} />}
                    value={`${formatDate(
                      currentItem?.created_at,
                      locale
                    )}, ${getWeekDay(currentItem?.created_at, t, "short")}`}
                    color={colors.contrast}
                  />
                </View>
                {currentItem?.updated_at && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("shared.info.lastUpdated")}
                      icon={<CalendarIcon color={colors.contrast} />}
                      value={`${formatDate(
                        currentItem?.updated_at,
                        locale
                      )}, ${getWeekDay(currentItem?.updated_at, t, "short")}`}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {mood && !Array.isArray(mood) && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("edit.common.mood.label")}
                      icon={
                        <Text
                          size="large"
                          style={{
                            lineHeight: 26,
                          }}
                        >
                          {mood?.emoji}
                        </Text>
                      }
                      value={mood?.label || ""}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {isDocument && currentItem?.reading_time && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("shared.info.readingTime")}
                      icon={<TimerIcon color={colors.contrast} />}
                      value={formatReadingTime(currentItem.reading_time, t)}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {isDocument && !isLoading && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("shared.info.progress")}
                      icon={<CheckIcon color={colors.contrast} />}
                      value={`${progress}%`}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {isTest && currentItem?.lead_time && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("test.leadTime")}
                      icon={<TimerIcon color={colors.contrast} />}
                      value={`${currentItem.lead_time} ${t(
                        "shared.time.minutes"
                      )}`}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {isTest && currentItem?.type && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("shared.info.type")}
                      value={t(`test.type.${currentItem?.type}`)}
                      icon={<ClipboardTextIcon color={colors.contrast} />}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {isTest && currentItem?.questions && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("shared.info.questionsCount")}
                      value={currentItem?.questions?.length}
                      icon={<DocumentTextIcon color={colors.contrast} />}
                      color={colors.contrast}
                    />
                  </View>
                )}
                {isTestResult && (
                  <View style={styles.infoTableItem}>
                    <InfoBox
                      label={t("shared.info.progress")}
                      value={`${
                        Object.values(currentItem?.answers || {}).filter(
                          Boolean
                        ).length
                      } ${t("shared.info.of")} ${
                        Object.keys(currentItem?.answers || {}).length
                      }`}
                      icon={<CheckIcon color={colors.contrast} />}
                      color={colors.contrast}
                    />
                  </View>
                )}
              </View>
              <Divider style={styles.divider} color={colors.alternate} />
              {currentItem?.content && (
                <>
                  <TitleText
                    text={t("libraryItem.content")}
                    textColor={colors.contrast}
                    element={<DotsIcon color={colors.contrast} size={22} />}
                    variant="subTitle"
                    style={styles.titleText}
                  />
                  <MarkdownEmojiText
                    color={colors.contrast}
                    style={styles.contentText}
                  >
                    {currentItem?.content}
                  </MarkdownEmojiText>
                  {currentItem?.command &&
                    [ENTITY_NAME.SUMMARIES, ENTITY_NAME.DOCUMENTS].includes(
                      variant
                    ) && (
                      <View style={{ marginTop: 18 }}>
                        <CommandWidget
                          currentItem={currentItem}
                          parentJournal={parentJournal as Journal}
                          sourceType={variant}
                        />
                      </View>
                    )}
                  <Divider style={styles.divider} color={colors.alternate} />
                </>
              )}
              {!!currentItem?.related_topics?.length && (
                <>
                  <TitleText
                    text={t("libraryItem.relatedTopics")}
                    textColor={colors.contrast}
                    element={<DotsIcon color={colors.contrast} size={22} />}
                    variant="subTitle"
                    style={styles.titleText}
                  />
                  <View style={styles.tagsBox}>
                    {currentItem?.related_topics?.map((tag: string) => (
                      <Chip
                        key={tag}
                        title={tag}
                        size="medium"
                        color={stringToColor(tag)}
                      />
                    ))}
                  </View>
                  <Divider style={styles.divider} color={colors.alternate} />
                </>
              )}
              {currentItem?.ai_response && (
                <>
                  <TitleText
                    text={t("libraryItem.aiResponse")}
                    textColor={colors.contrast}
                    element={<DotsIcon color={colors.contrast} size={22} />}
                    variant="subTitle"
                    style={styles.titleText}
                  />
                  <MarkdownEmojiText
                    color={colors.contrast}
                    style={styles.contentText}
                  >
                    {currentItem?.ai_response}
                  </MarkdownEmojiText>
                  {currentItem?.command && (
                    <View style={{ marginTop: 18 }}>
                      <CommandWidget
                        currentItem={currentItem}
                        parentJournal={parentJournal as Journal}
                        sourceType={variant}
                      />
                    </View>
                  )}
                  <Divider style={styles.divider} color={colors.alternate} />
                </>
              )}
              {checkboxes?.length > 0 && (
                <>
                  <TitleText
                    text={t("libraryItem.checklist")}
                    textColor={colors.contrast}
                    element={<DotsIcon color={colors.contrast} size={22} />}
                    variant="subTitle"
                    style={styles.titleText}
                  />
                  <CheckboxList>
                    {checkboxes?.map((item: ChecklistItem) => (
                      <CheckBox
                        textDecoration
                        key={item.id}
                        checked={item.is_completed}
                        onPress={() => handleCheckboxToggle(item.id)}
                        text={item.title}
                      />
                    ))}
                  </CheckboxList>
                  {isUpdatingChecklistItem && (
                    <Text
                      style={{ marginBottom: -16 }}
                      color={colors.contrast}
                      size="small"
                      withOpacity={70}
                    >
                      {t("shared.actions.saving")}...
                    </Text>
                  )}
                  <Divider style={styles.divider} color={colors.alternate} />
                </>
              )}
            </PaddingLayout>
            {/* Кнопка "Начать тест" для тестов */}
            {isTest && (
              <PaddingLayout>
                <Button
                  onPress={handleStartTest}
                  backgroundColor={
                    theme === "dark" ? colors.accent : colors.primary
                  }
                  textColor={theme === "dark" ? colors.primary : colors.white}
                >
                  {t("test.startTest")}
                </Button>
              </PaddingLayout>
            )}
            {!!currentItem?.related_entities?.length && (
              <View style={styles.carouselBox}>
                <ItemCarousel
                  title={t("libraryItem.relatedEntries")}
                  data={currentItem?.related_entities}
                  onPress={(item) => {
                    if (item.entity_type === ENTITY_NAME.CHATS) {
                      navigation.navigate(PATHS.CHAT, {
                        item,
                      });
                    } else if (item.entity_type === ENTITY_NAME.JOURNALS) {
                      navigation.navigate(PATHS.LIBRARY_LIST, {
                        variant: item.entity_type,
                        item,
                      });
                    } else {
                      navigation.push(PATHS.LIBRARY_ITEM, {
                        variant: item.entity_type,
                        item,
                      });
                    }
                  }}
                  modeConfig={{
                    ...carouselConfig,
                    parallaxAdjacentItemScale: 0.79,
                  }}
                  colors={colors}
                  style={styles.carousel}
                />
              </View>
            )}
          </ScrollView>
        </AnimatedAppearance>
      </BottomSheet>
    </Layout>
  );
};

export default LibraryItemScreen;
