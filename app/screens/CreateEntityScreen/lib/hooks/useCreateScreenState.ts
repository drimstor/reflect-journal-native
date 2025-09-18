import { useCreateAnyEntities, useEntitiesData } from "@/src/entities";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { PATHS } from "@/src/shared/const/PATHS";
import { formatDate, getWeekDay } from "@/src/shared/lib/helpers";
import {
  useBottomSheetIndexState,
  useLang,
  useT,
  useToggle,
} from "@/src/shared/lib/hooks";
import { EntityType, NavigationProps } from "@/src/shared/model/types";
import { useFiltersStore, useScreenInfoStore } from "@/src/shared/store";
import { useCarouselConfig } from "@/src/shared/ui";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useCreateForm } from "./useCreateForm";
import { useCreateFormConfig } from "./useCreateFormConfig";

/**
 * Тип конфигурации карусели
 */
interface CarouselConfig {
  parallaxScrollingScale: number;
  parallaxScrollingOffset: number;
  parallaxAdjacentItemScale: number;
}

/**
 * Хук для управления состоянием экрана создания сущности
 */
export const useCreateScreenState = (getSelectedImages?: () => any[]) => {
  const t = useT();
  const { locale } = useLang();
  const navigation = useNavigation<NavigationProps>();
  const { resetFilters } = useFiltersStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [snapPoints, setSnapPoints] = useState<number[]>([580]);

  // Состояния для компонента
  const { value: isBookmarked, toggle: setIsBookmarked } = useToggle();
  const [currentEntity, setCurrentEntity] = useState<string>(
    ENTITY_NAME.JOURNAL_ENTRIES
  );
  const { bottomSheetRef, snapToIndex, closeBottomSheet } =
    useBottomSheetIndexState();

  const { navigationScreenInfo, setNavigationScreenInfo } =
    useScreenInfoStore();

  // Обработчики для даты
  const handleDateClickForJournalEntries = () => {
    setSnapPoints([580]);
    requestAnimationFrame(() => {
      snapToIndex(0);
    });
  };

  // Обработчики для даты
  const handleDateClickForSummaries = () => {
    setSnapPoints([650]);
    requestAnimationFrame(() => {
      snapToIndex(0);
    });
  };

  // ------------------------------------------------------------ //

  // Получение данных журналов из выделенного хука
  const {
    entitiesDataTransformed: journalsDataTransformed,
    selectedEntityId: selectedJournalId,
    setSelectedEntityId: setSelectedJournalId,
    entitiesCarouselConfig: journalsCarouselConfig,
  } = useEntitiesData({ entityType: ENTITY_NAME.JOURNALS });

  // ------------------------------------------------------------ //

  // Конфигурация каруселей
  const carouselConfig = useCarouselConfig(25, 60);
  const entityCarouselConfig: CarouselConfig = {
    ...carouselConfig,
    parallaxAdjacentItemScale: 0.79,
  };

  // Получаем конфигурацию формы для выбранного типа сущности
  const formConfig = useCreateFormConfig(currentEntity);

  // Логика создания сущности
  const { createEntity, isLoading } = useCreateAnyEntities(
    currentEntity as EntityType
  );

  // Инициализируем форму
  const { values, errors, handleChange, handleSubmit } = useCreateForm(
    formConfig,
    async (formData) => {
      try {
        resetFilters();

        // Добавляем изображения для записей дневника
        if (
          currentEntity === ENTITY_NAME.JOURNAL_ENTRIES &&
          getSelectedImages
        ) {
          const selectedImages = getSelectedImages();
          if (selectedImages && selectedImages.length > 0) {
            formData.images = selectedImages;
          }
        }

        const item = await createEntity(formData);
        navigation.goBack();

        const params = {
          item,
          variant: currentEntity,
        };

        const pathConfig = {
          [ENTITY_NAME.CHATS]: PATHS.CHAT,
          [ENTITY_NAME.JOURNAL_ENTRIES]: PATHS.LIBRARY_ITEM,
          [ENTITY_NAME.JOURNALS]: PATHS.LIBRARY_LIST,
          [ENTITY_NAME.GOALS]: PATHS.LIBRARY_ITEM,
          [ENTITY_NAME.SUMMARIES]: PATHS.LIBRARY_ITEM,
        };

        setTimeout(() => {
          navigation.navigate(pathConfig[currentEntity], params);
          // navigation.getParent()?.navigate(pathConfig[currentEntity], params);
        }, 300);
      } catch (error) {
        console.error("Ошибка при создании:", error);
      }
    },
    currentEntity,
    isBookmarked,
    selectedJournalId
  );

  const date = useMemo(
    () => (values.created_at ? values.created_at.split("T")[0] : new Date()),
    [values.created_at]
  );

  // Форматируем дату для отображения в заголовке
  const formattedDate = useMemo(() => {
    return `${getWeekDay(date, t, "long")}, ${
      formatDate(date, locale).split(".")[0]
    }`;
  }, [date, t, locale]);

  // Мокдата для карусели выбора типа сущности
  const mockData = useMemo(
    () => [
      {
        created_at: date,
        entity_type: ENTITY_NAME.JOURNAL_ENTRIES,
        name: t("entities.journalentriesfull.singular"),
      },
      {
        created_at: date,
        entity_type: ENTITY_NAME.JOURNALS,
        name: t("entities.journals.singular"),
      },
      {
        created_at: date,
        entity_type: ENTITY_NAME.CHATS,
        name: t("entities.chats.singular"),
      },
      {
        created_at: date,
        entity_type: ENTITY_NAME.GOALS,
        name: t("entities.goals.singular"),
      },
      {
        created_at: date,
        entity_type: ENTITY_NAME.SUMMARIES,
        name: t("entities.summaries.singular"),
      },
    ],
    [date, t]
  );

  // Отслеживаем изменения navigationScreenInfo для переключения сущности
  useEffect(() => {
    if (
      navigationScreenInfo.name &&
      navigationScreenInfo.name !== currentEntity
    ) {
      setCurrentEntity(navigationScreenInfo.name);
      setNavigationScreenInfo({ name: "" });
    }
  }, [navigationScreenInfo.name]);

  const handleDateSelected = (field: string) => (date: string | null) => {
    if (date) {
      handleChange(field, `${date}T00:00:00Z`);
    } else {
      handleChange(field, null);
    }
    closeBottomSheet();
  };

  // Вычисляем текущий индекс карусели на основе выбранной сущности
  const currentEntityIndex = useMemo(() => {
    return mockData.findIndex((item) => item.entity_type === currentEntity);
  }, [currentEntity, mockData]);

  return {
    isBookmarked,
    setIsBookmarked,
    currentEntity,
    setCurrentEntity,
    mockData,
    currentEntityIndex,
    journalsDataTransformed,
    selectedJournalId,
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
    handleDateSelected,
    handleDateClickForJournalEntries,
    handleDateClickForSummaries,
    bottomSheetRef,
    snapPoints,
    setSnapPoints,
    snapToIndex,
    closeBottomSheet,
  };
};
