import React, { useMemo } from "react";
import {
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
  BottomSheetScrollView,
  Carousel,
  useCarouselConfig,
  BookIcon,
  MailIcon,
  Divider,
  TitleText,
  DocumentTextIcon,
  CategoryIcon,
  BrushIcon,
  Text,
  FullScreenChartLegend,
  AnimatedLoader,
  useAnimatedLoading,
  CpuIcon,
} from "@/src/shared/ui";
import {
  useThemeStore,
  useBottomSheetStore,
  useDeviceStore,
  useFiltersStore,
} from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useEditFormConfig } from "./lib/hooks/useEditFormConfig";
import { useEditForm } from "./lib/hooks/useEditForm";
import { useEffect, useState } from "react";
import {
  transformPortraitDataToCharts,
  useCreateSummaryMutation,
  useEntitiesData,
  useGetPortraitStatsQuery,
} from "@/src/entities";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { FormField, ItemCarousel } from "@/src/widgets";
import { PreviewCard } from "../..";
import { EntityType } from "@/src/shared/model/types";
import { CAROUSEL_ITEMS, CAROUSEL_ITEMS_WITH_CATEGORIES } from "./const/static";
import { View } from "react-native";
import { formatFromISODate } from "../DatePickerEntityView/lib/utils";
import { PATHS } from "@/src/shared/const/PATHS";

interface CreateSummaryViewProps {
  isBookmarked?: boolean;
  isStandalone?: boolean;
  navigationBack?: () => void;
  entityType?: EntityType;
  entityId?: string;
  dateValue?: string[];
  onDateClick?: () => void;
  onDateReset?: () => void;
}

const CreateSummaryView = ({
  isStandalone = false,
  navigationBack,
  entityType,
  entityId,
  dateValue,
  onDateClick,
  onDateReset,
}: CreateSummaryViewProps) => {
  const t = useT();
  const {
    resetFlowData,
    setBottomSheetVisible,
    setNavigation,
    navigateToFlow,
  } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();

  const [currentItemIndex, setCurrentItemIndex] = useState<number>(
    entityType ? CAROUSEL_ITEMS_WITH_CATEGORIES.indexOf(entityType) : 0
  );

  // ------------------------------------------------------------ //

  const currentCarouselItem = CAROUSEL_ITEMS[currentItemIndex];

  const {
    entitiesDataTransformed,
    selectedEntityId,
    setSelectedEntityId,
    entitiesCarouselConfig,
    isLoading: isLoadingEntities,
  } = useEntitiesData({
    entityType: currentCarouselItem,
    skip: !isStandalone,
  });

  const chooseComponent = (
    <ItemCarousel
      title={t(`addEntry.choose.${currentCarouselItem?.toLowerCase()}`)}
      data={entitiesDataTransformed}
      onSelectItem={(index) => {
        if (entitiesDataTransformed && entitiesDataTransformed[index]) {
          setSelectedEntityId(entitiesDataTransformed[index].id);
        }
      }}
      modeConfig={entitiesCarouselConfig}
      colors={colors}
      style={{ marginBottom: 25 }} // Увеличенный отступ для журналов
    />
  );

  // ------------------------------------------------------------ //

  const isCategories = currentItemIndex === 2;
  const isTopics = currentItemIndex === 3;

  // Запрос на получение данных с учетом фильтров
  const { data, isLoading: isLoadingCharts } = useGetPortraitStatsQuery(
    { min_count: 1, limit: 25 },
    { skip: !isCategories && !isTopics }
  );
  // Трансформируем данные в формат для диаграмм
  const chartsData = useMemo(
    () => transformPortraitDataToCharts(data, t),
    [data, t]
  );

  const { resetFilters, multi_select_ids } = useFiltersStore();

  useEffect(() => {
    resetFilters();
  }, [currentItemIndex]);

  // ------------------------------------------------------------ //

  const ITEMS = [
    {
      id: ENTITY_NAME.JOURNAL,
      colorKey: "blue",
      getIcon: (color: string, size: number) => (
        <BookIcon color={color} size={size} />
      ),
      chooseComponent,
    },
    {
      id: ENTITY_NAME.CHAT,
      colorKey: "purple",
      getIcon: (color: string, size: number) => (
        <MailIcon color={color} size={size} />
      ),
      chooseComponent,
    },
    {
      id: "categories",
      colorKey: "green",
      getIcon: (color: string, size: number) => (
        <CategoryIcon color={color} size={size} />
      ),
      title: t("create.categories.title"),
      subTitle: t("create.categories.description"),
    },
    {
      id: "topics",
      colorKey: "orange",
      getIcon: (color: string, size: number) => (
        <DocumentTextIcon color={color} size={size} />
      ),
      title: t("create.topics.title"),
      subTitle: t("create.topics.description"),
    },
    {
      id: "allData",
      colorKey: "pink",
      getIcon: (color: string, size: number) => (
        <CpuIcon color={color} size={size} />
      ),
      title: t("create.allData.title"),
      subTitle: t("create.allData.description"),
    },
    {
      id: "customRequest",
      colorKey: "error",
      getIcon: (color: string, size: number) => (
        <BrushIcon color={color} size={size} />
      ),
      title: t("create.customRequest.title"),
      subTitle: t("create.customRequest.description"),
    },
  ];

  // ------------------------------------------------------------ //

  // Получаем конфигурацию формы в зависимости от типа currentItemIndex
  const formConfig = useEditFormConfig(ITEMS[currentItemIndex].id);

  const [createSummary, { isLoading: isCreatingSummary }] =
    useCreateSummaryMutation();

  // Инициализируем форму с начальными значениями из конфигурации
  const { values, errors, handleChange, handleSubmit, resetForm } = useEditForm(
    formConfig,
    async (formData) => {
      try {
        const result = await createSummary({
          ...formData,
          summary_type: entityType || ITEMS[currentItemIndex].id,
          ...(currentCarouselItem && {
            entity_id: entityId || selectedEntityId || "",
          }),
          ...(dateValue?.[0] && { created_at_from: dateValue[0] }),
          ...(dateValue?.[1] && { created_at_to: dateValue[1] }),
          ...(multi_select_ids?.length && {
            ...(isCategories && { categories: multi_select_ids }),
            ...(isTopics && { topics: multi_select_ids }),
          }),
        }).unwrap();

        if (isStandalone) {
          navigationBack?.();
        } else {
          handleClose();
        }

        setTimeout(
          () => {
            const params = { item: result, variant: ENTITY_NAME.SUMMARY };
            setNavigation(true, PATHS.LIBRARY_ITEM, params);
          },
          isStandalone ? 200 : 300
        );
      } catch (error) {
        console.error("Ошибка при создании сумммари:", error);
      }
    }
  );

  // ------------------------------------------------------------ //

  // Эффект для сброса формы при изменении конфигурации
  useEffect(() => {
    resetForm();
  }, [formConfig, resetForm]);

  // Обработчик возврата
  const handleClose = () => {
    if (!isStandalone) {
      resetFlowData();
      setTimeout(() => {
        setBottomSheetVisible(false);
      }, 100);
    }
  };

  const handleBack = () => {
    if (!isStandalone) {
      navigateToFlow("common", "list");
      onDateReset?.();
    }
  };

  // Используем хук для анимированного лоадера экрана
  const {
    isLoading: isScreenLoading,
    startLoading: handleScreenLoading,
    animatedStyle,
  } = useAnimatedLoading({
    externalIsLoading: isLoadingEntities || isLoadingCharts,
  });

  const carouselConfig = useCarouselConfig(50, 140);

  useEffect(() => {
    if (!isStandalone) {
      handleScreenLoading();
    }
  }, [isStandalone]);

  const periodButton = () => (
    <View style={{ marginVertical: 8 }}>
      <Text color={colors.contrast} style={{ marginBottom: 10 }}>
        {t("date.period.title")}
      </Text>
      <Button
        onPress={onDateClick || (() => {})}
        backgroundColor={colors.light}
        textColor={colors.contrast}
      >
        {`${
          dateValue?.[0]
            ? formatFromISODate(dateValue?.[0])
            : t("date.period.all")
        }${
          dateValue?.[1]
            ? ` - ${formatFromISODate(dateValue?.[1])}`
            : dateValue?.[0]
            ? ` - ${t("date.untilToday")}`
            : ""
        }`}
      </Button>
    </View>
  );

  const renderContent = () => (
    <>
      {isStandalone && (
        <View>
          <PaddingLayout>
            <TitleText
              text={t("create.title")}
              textColor={colors.contrast}
              variant="subTitle"
              style={{ marginVertical: 5 }}
            />
          </PaddingLayout>
          <Carousel
            height={100}
            style={{ marginBottom: 8, marginTop: 2 }}
            mode="parallax"
            handler={(index) => {
              handleScreenLoading();
              setCurrentItemIndex(index);
            }}
            modeConfig={carouselConfig}
            renderItem={({ item }) => (
              <PreviewCard
                backgroundColor={item.backgroundColor}
                title={item.title}
                subTitle={item.subTitle}
                icon={item.icon}
              />
            )}
            data={ITEMS.map((item) => ({
              title:
                item.title || t(`entities.${item.id.toLowerCase()}.singular`),
              subTitle:
                item.subTitle ||
                t(`library.${item.id.toLowerCase()}.description`),
              backgroundColor: colors[item.colorKey as keyof typeof colors],
              icon: item.getIcon(colors.black, 40),
            }))}
          />
          <Divider color={colors.alternate} />
        </View>
      )}

      <View style={{ position: "relative" }}>
        <AnimatedLoader
          isVisible={isScreenLoading}
          animatedStyle={animatedStyle}
          size={window.width - 100}
          backgroundColor={colors.secondary}
          containerStyle={{
            minHeight: 1000,
            paddingTop: isStandalone ? 0 : 40,
          }}
        />
      </View>
      {isStandalone ? (
        ITEMS[currentItemIndex].chooseComponent
      ) : (
        <>
          <PaddingLayout style={{ marginBottom: 5 }}>
            <Text size="normal" color={colors.contrast}>
              {t(
                `edit.${ITEMS[
                  currentItemIndex
                ].id.toLowerCase()}.createDescription`
              )}
            </Text>
          </PaddingLayout>
          <Divider color={colors.alternate + 70} />
        </>
      )}
      {(isCategories || isTopics) &&
        chartsData?.top_types?.data &&
        chartsData?.top_nodes?.data && (
          <PaddingLayout style={{ paddingBottom: 30 }}>
            <FullScreenChartLegend
              data={
                isCategories
                  ? chartsData?.top_types?.data
                  : chartsData?.top_nodes?.data
              }
              isSelectMode
            />
          </PaddingLayout>
        )}
      {!isStandalone && (
        <PaddingLayout style={{ marginBottom: 14 }}>
          {periodButton()}
        </PaddingLayout>
      )}
      <PaddingLayout style={{ gap: 12 }}>
        {formConfig.fields.map((field) => (
          <FormField
            key={field.key}
            field={field}
            value={values[field.key]}
            error={errors[field.key]}
            onChange={handleChange}
          />
        ))}
        {isStandalone && periodButton()}
      </PaddingLayout>
    </>
  );

  const renderFooter = () => (
    <BottomSheetFooter isBorderGap={isStandalone}>
      <Button
        backgroundColor={theme === "dark" ? colors.accent : colors.primary}
        textColor={theme === "dark" ? colors.primary : colors.white}
        onPress={handleSubmit}
        // disabled={isDisabled}
        isLoading={isCreatingSummary}
      >
        {t("shared.actions.create")}
      </Button>
    </BottomSheetFooter>
  );

  // Для автономного режима (как в CreateEntity)
  if (isStandalone) {
    return (
      <>
        {renderContent()}
        {renderFooter()}
      </>
    );
  }

  // Для режима BottomSheet (как в оригинальном CreateSummaryView)
  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("edit.summaries.create")}
        onClose={handleClose}
        onBack={handleBack}
      />
      <BottomSheetScrollView
        customMaxHeight={window.height - 350}
        additionalHeight={305}
      >
        <View style={{ paddingVertical: 16, paddingBottom: 24 }}>
          {renderContent()}
        </View>
      </BottomSheetScrollView>
      {renderFooter()}
    </BottomSheetBox>
  );
};

export default CreateSummaryView;
