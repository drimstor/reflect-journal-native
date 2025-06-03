import { useState, useMemo, useRef } from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFiltersStore } from "@/src/shared/store";
import {
  useLang,
  useT,
  useToggle,
  useBottomSheetIndexState,
} from "@/src/shared/lib/hooks";
import { useCarouselConfig } from "@/src/shared/ui";
import { NavigationProps, EntityType } from "@/src/shared/model/types";
import { formatDate, getWeekDay } from "@/src/shared/lib/helpers";
import { useCreateAnyEntities } from "@/src/entities";
import { useEntitiesData } from "@/src/entities";
import { useCreateFormConfig } from "./useCreateFormConfig";
import { useCreateForm } from "./useCreateForm";
import { ENTITY_PLURAL } from "@/src/shared/const/ENTITIES";
import { PATHS } from "@/src/shared/const/PATHS";

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
export const useCreateScreenState = () => {
  const t = useT();
  const { locale } = useLang();
  const navigation = useNavigation<NavigationProps>();
  const { resetFilters } = useFiltersStore();
  const scrollViewRef = useRef<ScrollView>(null);

  // Состояния для компонента
  const { value: isBookmarked, toggle: setIsBookmarked } = useToggle();
  const [currentEntity, setCurrentEntity] = useState<string>(
    ENTITY_PLURAL.JOURNAL_ENTRY
  );
  const { bottomSheetRef, snapToIndex, closeBottomSheet } =
    useBottomSheetIndexState();

  // Обработчики для даты
  const handleDateClick = () => {
    snapToIndex(0);
  };

  // ------------------------------------------------------------ //

  // Получение данных журналов из выделенного хука
  const {
    entitiesDataTransformed: journalsDataTransformed,
    selectedEntityId: selectedJournalId,
    setSelectedEntityId: setSelectedJournalId,
    entitiesCarouselConfig: journalsCarouselConfig,
  } = useEntitiesData(ENTITY_PLURAL.JOURNAL);

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
        const item = await createEntity(formData);
        console.log("Создаем сущность:", currentEntity, item);
        navigation.goBack();

        const params = {
          item,
          variant: currentEntity,
        };

        const pathConfig = {
          [ENTITY_PLURAL.CHAT]: PATHS.CHAT,
          [ENTITY_PLURAL.JOURNAL_ENTRY]: PATHS.LIBRARY_ITEM,
          [ENTITY_PLURAL.JOURNAL]: PATHS.LIBRARY_LIST,
          [ENTITY_PLURAL.GOAL]: PATHS.LIBRARY_ITEM,
          [ENTITY_PLURAL.SUMMARY]: PATHS.LIBRARY_ITEM,
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
  const mockData = [
    {
      created_at: date,
      entity_type: ENTITY_PLURAL.JOURNAL_ENTRY,
      name: t("entities.journalentriesfull.singular"),
    },
    {
      created_at: date,
      entity_type: ENTITY_PLURAL.JOURNAL,
      name: t("entities.journals.singular"),
    },
    {
      created_at: date,
      entity_type: ENTITY_PLURAL.CHAT,
      name: t("entities.chats.singular"),
    },
    {
      created_at: date,
      entity_type: ENTITY_PLURAL.GOAL,
      name: t("entities.goals.singular"),
    },
    {
      created_at: date,
      entity_type: ENTITY_PLURAL.SUMMARY,
      name: t("entities.summaries.singular"),
    },
  ];

  const handleDateSelected = (field: string) => (date: string | null) => {
    if (date) {
      handleChange(field, `${date}T00:00:00Z`);
    } else {
      handleChange(field, null);
    }
    closeBottomSheet();
  };

  return {
    isBookmarked,
    setIsBookmarked,
    currentEntity,
    setCurrentEntity,
    mockData,
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
    handleDateClick,
    handleDateSelected,
    bottomSheetRef,
  };
};
