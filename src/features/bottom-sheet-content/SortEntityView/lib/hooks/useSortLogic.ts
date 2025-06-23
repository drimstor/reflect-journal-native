import { useT } from "@/src/shared/lib/hooks";
import { SortField, SortOrder } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useFiltersStore,
  useScreenInfoStore,
} from "@/src/shared/store";
import { CalendarIcon, EditPencilIcon, IntegerIcon } from "@/src/shared/ui";
import { useEffect, useState } from "react";
import { ENTITY_NAME } from "../../../../../shared/const/ENTITIES";

interface SortAction {
  text: string;
  key: string;
  IconComponent: React.ComponentType<any>;
  iconSize?: number;
}

interface UseSortLogicResult {
  activeSort: SortField;
  sortDirection: SortOrder;
  setActiveSort: (sort: SortField) => void;
  setSortDirection: (direction: SortOrder) => void;
  submitSort: () => void;
  actions: SortAction[];
  toggleSortDirection: () => void;
  handleReset: () => void;
  isCleared: boolean;
}

export const useSortLogic = (): UseSortLogicResult => {
  const t = useT();
  const { setSortField, setSortOrder, sort_field, sort_order } =
    useFiltersStore();
  const { setBottomSheetVisible } = useBottomSheetStore();

  const { screenInfo } = useScreenInfoStore();
  const screenName = screenInfo?.name;

  const INITIAL_SORT_ORDER = "desc";

  const getInitialSortField = () => {
    switch (screenName) {
      case "Charts":
        return "count";
      case ENTITY_NAME.JOURNAL_ENTRIES:
        return "created_at";
      case ENTITY_NAME.TESTS:
        return "created_at";
      default:
        return "updated_at";
    }
  };

  const INITIAL_SORT_FIELD = getInitialSortField();

  // Состояние для активной сортировки и направления
  const [activeSort, setActiveSort] = useState<SortField>(INITIAL_SORT_FIELD);
  const [sortDirection, setSortDirection] =
    useState<SortOrder>(INITIAL_SORT_ORDER);

  const handleSetInitialState = () => {
    setActiveSort(INITIAL_SORT_FIELD);
    setSortDirection(INITIAL_SORT_ORDER);
  };

  const isInitialStates =
    activeSort === INITIAL_SORT_FIELD && sortDirection === INITIAL_SORT_ORDER;

  const isCleared =
    isInitialStates && sort_field === undefined && sort_order === undefined;

  // Сброс состояния при изменении экрана или видимости нижнего листа
  useEffect(() => {
    handleSetInitialState();
  }, [screenInfo]);

  // Функция для переключения направления сортировки
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Функция для применения сортировки
  const submitSort = () => {
    if (!isInitialStates) {
      setSortField(activeSort);
      setSortOrder(sortDirection);
    }
    setBottomSheetVisible(false);
  };

  const handleReset = () => {
    handleSetInitialState();
    setSortField(undefined);
    setSortOrder(undefined);
  };

  let actions: SortAction[] = [];

  if (screenName === "Charts") {
    actions = [
      {
        text: t("sort.sortByCount"),
        key: "count",
        IconComponent: IntegerIcon,
        iconSize: 25,
      },
      {
        text: t("sort.sortByName"),
        key: "name",
        IconComponent: EditPencilIcon,
      },
      {
        text: t("sort.sortByUpdated"),
        key: "updated_at",
        IconComponent: CalendarIcon,
      },
    ];
  } else if (screenName === ENTITY_NAME.TESTS) {
    actions = [
      {
        text: t("sort.sortByName"),
        key: "name",
        IconComponent: EditPencilIcon,
      },
      {
        text: t("sort.sortByCreated"),
        key: "created_at",
        IconComponent: CalendarIcon,
      },
    ];
  } else {
    actions = [
      {
        text: t("sort.sortByName"),
        key: "name",
        IconComponent: EditPencilIcon,
      },
      {
        text: t("sort.sortByCreated"),
        key: "created_at",
        IconComponent: CalendarIcon,
      },
      {
        text: t("sort.sortByUpdated"),
        key: "updated_at",
        IconComponent: CalendarIcon,
      },
    ];
  }

  return {
    activeSort,
    sortDirection,
    setActiveSort,
    setSortDirection,
    submitSort,
    actions,
    toggleSortDirection,
    handleReset,
    isCleared,
  };
};
