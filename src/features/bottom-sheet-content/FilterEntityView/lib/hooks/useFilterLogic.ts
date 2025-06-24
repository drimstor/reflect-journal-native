import { useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useFiltersStore,
  useScreenInfoStore,
} from "@/src/shared/store";
import {
  CategoryIcon,
  ClipboardCheckIcon,
  CpuIcon,
  DocumentTextIcon,
} from "@/src/shared/ui";
import { useEffect, useState } from "react";
import { ENTITY_NAME } from "../../../../../shared/const/ENTITIES";

interface SortAction {
  text: string;
  key: string;
  IconComponent: React.ComponentType<any>;
  iconSize?: number;
  type: string | "buttonInput" | "checkbox";
  placeholder?: string;
}

interface useFilterLogicResult {
  submitFilter: () => void;
  actions: SortAction[];
  handleReset: () => void;
  activeFilter: string[];
  setActiveFilter: (filter: string[]) => void;
  inputValues: Record<string, string>;
  setInputValue: (key: string, value: string) => void;
  isFiltered: boolean;
}

export const useFilterLogic = (): useFilterLogicResult => {
  const t = useT();
  const {
    setIsCompleted,
    setAiResponse,
    setRelatedTopics,
    ai_response,
    is_completed,
    related_topics,
    setCategory,
    category,
  } = useFiltersStore();
  const { setBottomSheetVisible } = useBottomSheetStore();
  const { screenInfo } = useScreenInfoStore();

  const variant = screenInfo.name as EntityType;

  const [inputValues, setInputValues] = useState<Record<string, string>>({
    related_topics: related_topics ?? "",
    category: category ?? "",
  });
  const [activeFilter, setActiveFilter] = useState<string[]>([]);

  const setInputValue = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };

  // Сброс состояния при изменении экрана или видимости нижнего листа
  useEffect(() => {
    setActiveFilter([]);
    setInputValues({ related_topics: "", category: "" });
  }, [screenInfo]);

  // Функция для применения сортировки
  const submitFilter = () => {
    setBottomSheetVisible(false);

    if (activeFilter.includes("is_completed")) {
      setIsCompleted(true);
    }
    if (activeFilter.includes("ai_response")) {
      setAiResponse(true);
    }

    if (activeFilter.includes("related_topics")) {
      setRelatedTopics(inputValues.related_topics);
    }

    if (activeFilter.includes("category")) {
      setCategory(inputValues.category);
    }
  };

  const handleReset = () => {
    setActiveFilter([]);
    setIsCompleted(undefined);
    setAiResponse(undefined);
    setRelatedTopics(undefined);
    setCategory(undefined);
    setInputValues({ related_topics: "", category: "" });
  };

  const relatedTopicsConfig = {
    text: t("filter.filterByRelatedTopics"),
    key: "related_topics",
    IconComponent: DocumentTextIcon,
    iconSize: 22,
    type: "buttonInput",
    placeholder: t("filter.enterTopic") + "...",
  };

  const categoryConfig = {
    text: t("filter.filterByCategory"),
    key: "category",
    IconComponent: CategoryIcon,
    iconSize: 22,
    type: "buttonInput",
    placeholder: t("filter.enterCategory") + "...",
  };

  const aiResponseConfig = {
    text: t("filter.filterByAIResponse"),
    key: "ai_response",
    IconComponent: CpuIcon,
    type: "checkbox",
  };

  const isCompletedConfig = {
    text: t("filter.filterByChecked"),
    key: "is_completed",
    IconComponent: ClipboardCheckIcon,
    iconSize: 22,
    type: "checkbox",
  };

  const actionsConfig = {
    [ENTITY_NAME.GOALS]: [isCompletedConfig, relatedTopicsConfig],
    [ENTITY_NAME.CHATS]: [relatedTopicsConfig],
    [ENTITY_NAME.JOURNALS]: [aiResponseConfig, relatedTopicsConfig],
    [ENTITY_NAME.SUMMARIES]: [relatedTopicsConfig],
    [ENTITY_NAME.JOURNAL_ENTRIES]: [relatedTopicsConfig],
    [ENTITY_NAME.TESTS]: [relatedTopicsConfig],
    [ENTITY_NAME.TEST_RESULTS]: [relatedTopicsConfig],
    Charts: [relatedTopicsConfig, categoryConfig],
  };

  // Доступные варианты сортировки
  const actions: SortAction[] =
    actionsConfig[variant as keyof typeof actionsConfig];

  const isFiltered = !!(
    ai_response ||
    is_completed ||
    related_topics ||
    category ||
    Object.values(inputValues).some((value) => value) ||
    activeFilter.length > 0
  );

  return {
    submitFilter,
    actions,
    handleReset,
    activeFilter,
    setActiveFilter,
    inputValues,
    setInputValue,
    isFiltered,
  };
};
