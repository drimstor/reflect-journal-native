import React, { FC, useEffect, useState } from "react";
import {
  CheckBox,
  CheckboxList,
  Divider,
  Layout,
  Text,
  MarkdownEmojiText,
  Chip,
  TitleText,
  InfoBox,
  BottomSheet,
  PaddingLayout,
  useCarouselConfig,
  useBottomSheetActions,
  AnimatedAppearance,
} from "@/src/shared/ui";
import {
  Header,
  useHeaderStore,
  ItemCarousel,
  CommandWidget,
} from "@/src/widgets";
import { useLang, useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import { ScrollView, View } from "react-native";
import { CalendarIcon, DotsIcon } from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryItemScreen.styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { formatDate, getWeekDay } from "@/src/shared/lib/helpers";
import { stringToColor } from "@/src/shared/lib/helpers";
import { ChecklistItem } from "@/src/entities/goals/model/types";
import { PATHS } from "@/src/shared/const";
import { useChecklistActions } from "./lib/hooks/useChecklistActions";
import { Journal, useGetAnyEntity, useGetMood } from "@/src/entities";
import { StackNavigationProps } from "@/src/shared/model/types";
import { ENTITY_PLURAL } from "@/src/shared/const/ENTITIES";

interface LibraryItemScreenProps {}

const LibraryItemScreen: FC<LibraryItemScreenProps> = () => {
  const t = useT();
  const { locale } = useLang();
  const { colors } = useThemeStore();
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

  const isJournalEntry = variant === ENTITY_PLURAL.JOURNAL_ENTRY;

  useEffect(() => {
    setCurrentItem(data || item);
  }, [item, data]);

  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [variant]);

  // ------------------------------------------------------------ //

  const { data: parentJournal } = useGetAnyEntity({
    type: ENTITY_PLURAL.JOURNAL,
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

  console.log(currentItem?.related_entities);

  return (
    <Layout>
      <Header
        title={t(`entities.${variant.toLowerCase()}.singular`)}
        subtitle={subtitle}
        backButton
        rightIcon={{
          icon: <DotsIcon color={colors.contrast} size={22} />,
          onPress: handlePress,
        }}
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
                    variant === ENTITY_PLURAL.SUMMARY && (
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
            {!!currentItem?.related_entities?.length && (
              <View style={styles.carouselBox}>
                <ItemCarousel
                  title={t("libraryItem.relatedEntries")}
                  data={currentItem?.related_entities}
                  onPress={(item) => {
                    if (item.entity_type === ENTITY_PLURAL.CHAT) {
                      navigation.navigate(PATHS.CHAT, {
                        item,
                      });
                    } else if (item.entity_type === ENTITY_PLURAL.JOURNAL) {
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
