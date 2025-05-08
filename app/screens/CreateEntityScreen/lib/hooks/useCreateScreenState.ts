import { useState, useMemo, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFiltersStore, useAppSelector, RootState } from "@/src/shared/store";
import { useLang, useT, useToggle, useKeyboard } from "@/src/shared/lib/hooks";
import { useCarouselConfig } from "@/src/shared/ui";
import { NavigationProps, LibraryListVariant } from "@/src/shared/model/types";
import { formatDate, getWeekDay } from "@/src/shared/lib/helpers";
import {
  JournalResponse,
  useCreateAnyEntities,
  useGetJournalsQuery,
} from "@/src/entities";
import { useCreateFormConfig } from "./useCreateFormConfig";
import { useCreateForm } from "./useCreateForm";

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
  const { isKeyboardVisible } = useKeyboard();

  // Состояния для компонента
  const { value: isBookmarked, toggle: setIsBookmarked } = useToggle();
  const [currentEntity, setCurrentEntity] = useState<string>("JournalEntries");

  // Получение даты и форматирование
  const today = useMemo(() => new Date().toISOString(), []);
  const date = useMemo(() => {
    return `${getWeekDay(today, t, "long")}, ${
      formatDate(today, locale).split(".")[0]
    }`;
  }, [locale, t, today]);

  // Мокдата для карусели выбора типа сущности
  const mockData = [
    {
      created_at: today,
      entity_type: "JournalEntries",
      name: t("entities.journalentriesfull.singular"),
    },
    {
      created_at: today,
      entity_type: "Journals",
      name: t("entities.journals.singular"),
    },
    {
      created_at: today,
      entity_type: "Chats",
      name: t("entities.chats.singular"),
    },
    {
      created_at: today,
      entity_type: "Goals",
      name: t("entities.goals.singular"),
    },
    {
      created_at: today,
      entity_type: "Summaries",
      name: t("entities.summaries.singular"),
    },
  ];

  // Получение дневников
  const { data: journalsData } = useGetJournalsQuery({
    params: "?page=1&limit=50",
  });

  // Трансформация данных дневников для карусели
  const cachedJournalsDataTransformed = useMemo(() => {
    return journalsData?.data?.map((item) => ({ ...item, description: "" }));
  }, [journalsData]);

  // Состояние выбранного журнала
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    journalsData?.data?.[0]?.id || null
  );

  // Конфигурация каруселей
  const carouselConfig = useCarouselConfig(25, 60);
  // Получаем полную конфигурацию с добавлением недостающего свойства
  const entityCarouselConfig: CarouselConfig = {
    ...carouselConfig,
    parallaxAdjacentItemScale: 0.79,
  };

  // Конфигурация для карусели журналов
  const journalsConfig = useCarouselConfig(
    25,
    journalsData?.data?.length && journalsData?.data?.length > 1 ? 60 : 0
  );
  const journalsCarouselConfig: CarouselConfig = {
    ...journalsConfig,
    parallaxAdjacentItemScale: 0.79,
  };

  // Прокрутка при появлении клавиатуры
  useEffect(() => {
    if (isKeyboardVisible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } else {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }
  }, [isKeyboardVisible]);

  // Получаем конфигурацию формы для выбранного типа сущности
  const formConfig = useCreateFormConfig(currentEntity);

  // Логика создания сущности
  const { createEntity, isLoading, isSuccess } = useCreateAnyEntities(
    currentEntity as LibraryListVariant
  );

  // Инициализируем форму
  const { values, errors, handleChange, handleSubmit } = useCreateForm(
    formConfig,
    async (formData) => {
      try {
        console.log("Создаем сущность:", currentEntity, formData);
        resetFilters();
        const res = await createEntity(formData);
        console.log({ res });
        navigation.goBack();
      } catch (error) {
        console.error("Ошибка при создании:", error);
      }
    },
    currentEntity,
    isBookmarked,
    selectedJournalId
  );

  return {
    t,
    date,
    isBookmarked,
    setIsBookmarked,
    currentEntity,
    setCurrentEntity,
    mockData,
    journalsData,
    cachedJournalsDataTransformed,
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
  };
};
