import React, { FC, useEffect, useState } from "react";
import {
  CheckBox,
  CheckboxList,
  Divider,
  Layout,
  Text,
  Chip,
  TitleText,
  InfoBox,
  BottomSheet,
  Carousel,
  PaddingLayout,
  useCarouselConfig,
  useBottomSheetActions,
} from "@/src/shared/ui";
import { Header, useHeaderStore } from "@/src/widgets";
import { useLang, useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import { TypedPreviewBlock } from "@/src/features";
import { ScrollView, View, Animated } from "react-native";
import { CalendarIcon, DotsIcon } from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryItemScreen.styles";
import { useRoute } from "@react-navigation/native";
import { formatDate, getWeekDay } from "@/src/shared/lib/helpers";
import { stringToColor } from "@/src/shared/lib/helpers";
import { ChecklistItem } from "@/src/entities/goals/model/types";
import { PATHS } from "@/src/shared/const";
import { useChecklistActions } from "./lib/hooks/useChecklistActions";

interface LibraryItemScreenProps {}

const LibraryItemScreen: FC<LibraryItemScreenProps> = () => {
  const t = useT();
  const { locale } = useLang();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const { subtitle } = useHeaderStore();

  // const { handleScroll, handleScrollEnd, visibleAnimation } = usePullToAction({
  //   onAction: navigation.goBack,
  // });

  const route = useRoute();
  const { variant, item } = route.params as any;

  const { checkboxes, isUpdatingChecklistItem, handleCheckboxToggle } =
    useChecklistActions(variant, item.id, item?.checklist || []);

  const { setNavigation } = useBottomSheetStore();

  useEffect(() => {
    setNavigation(false, PATHS.LIBRARY);
  }, [variant]);

  const { handlePress } = useBottomSheetActions(variant, item);

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
        {/* <Animated.View style={[styles.pullIcon, visibleAnimation]}>
          <BackSquareIcon color={colors.contrast} size={24} />
        </Animated.View> */}
        <ScrollView
          contentContainerStyle={styles.globalViewHorizontal}
          showsVerticalScrollIndicator={false}
          // onScroll={handleScroll}
          // onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          style={{ maxHeight: window.height - 160 }}
        >
          <PaddingLayout>
            {variant !== "JournalEntries" && (
              <View style={[styles.titleBox]}>
                <Text size="extraLarge" font="bold" color={colors.contrast}>
                  {item?.name}
                </Text>
                {item?.related_topics?.[0] && (
                  <Chip
                    color={stringToColor(item?.related_topics?.[0])}
                    title={item?.related_topics?.[0]}
                  />
                )}
              </View>
            )}
            <View style={styles.infoTableBox}>
              <View style={styles.infoTableItem}>
                <InfoBox
                  label={t("shared.info.created")}
                  icon={
                    <CalendarIcon variant="outlined" color={colors.contrast} />
                  }
                  value={`${formatDate(item?.created_at, locale)}, ${getWeekDay(
                    item?.created_at,
                    t,
                    "short"
                  )}`}
                  color={colors.contrast}
                />
              </View>
              <View style={styles.infoTableItem}>
                <InfoBox
                  label={t("shared.info.lastUpdated")}
                  icon={
                    <CalendarIcon variant="outlined" color={colors.contrast} />
                  }
                  value={`${formatDate(item?.updated_at, locale)}, ${getWeekDay(
                    item?.updated_at,
                    t,
                    "short"
                  )}`}
                  color={colors.contrast}
                />
              </View>
              {/* <View style={styles.infoTableItem}>
                <InfoBox
                  label="Assigned to"
                  icon={<UserBorderIcon color={colors.contrast} />}
                  value="Tony Ware"
                  color={colors.contrast}
                />
              </View> */}
            </View>
            <Divider style={styles.divider} color={colors.alternate} />
            {item?.content && (
              <>
                <TitleText
                  text={t("libraryItem.content")}
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
                <Text color={colors.contrast} style={styles.contentText}>
                  {item?.content}
                </Text>
                <Divider style={styles.divider} color={colors.alternate} />
              </>
            )}
            {item?.related_topics?.length && (
              <>
                <TitleText
                  text={t("libraryItem.relatedTopics")}
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
                <View style={styles.tagsBox}>
                  {item?.related_topics?.map((tag: string) => (
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
            {item?.ai_response && (
              <>
                <TitleText
                  text={t("libraryItem.aiResponse")}
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
                <Text color={colors.contrast} style={styles.contentText}>
                  {item?.ai_response}
                </Text>
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
          {!!item?.related_entities?.length && (
            <View style={styles.carouselBox}>
              <PaddingLayout>
                <TitleText
                  text={t("libraryItem.relatedEntries")}
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
              </PaddingLayout>
              <Carousel
                height={130}
                style={styles.carousel}
                mode="parallax"
                data={item?.related_entities}
                handler={(index) => {
                  // setCurrentIndex(index);
                  // resetFilters();
                }}
                modeConfig={useCarouselConfig(
                  25,
                  item?.related_entities?.length > 1 ? 60 : 0
                )}
                renderItem={TypedPreviewBlock({
                  onPress: () => {},
                  disableAnimate: true,
                  previewMode: true,
                })}
              />
            </View>
          )}
        </ScrollView>
      </BottomSheet>
    </Layout>
  );
};

export default LibraryItemScreen;
