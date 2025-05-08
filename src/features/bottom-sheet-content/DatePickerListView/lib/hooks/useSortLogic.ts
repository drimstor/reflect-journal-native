import { useState, useEffect } from "react";
import { SortField, SortOrder } from "@/src/shared/model/types";
import {
  useFiltersStore,
  useBottomSheetStore,
  useScreenInfoStore,
} from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { EditPencilIcon, CalendarIcon } from "@/src/shared/ui";

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
}

export const useSortLogic = (): UseSortLogicResult => {
  const t = useT();
  const { setSortField, setSortOrder, sort_field, sort_order } =
    useFiltersStore();
  const { setBottomSheetVisible } = useBottomSheetStore();
  const { screenInfo } = useScreenInfoStore();

  // Состояние для активной сортировки и направления
  const [activeSort, setActiveSort] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortOrder>("desc");

  const handleSetInitialState = () => {
    setActiveSort("updated_at");
    setSortDirection("desc");
  };

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
    setSortField(activeSort);
    setSortOrder(sortDirection);
    setBottomSheetVisible(false);
  };

  const handleReset = () => {
    handleSetInitialState();
    setSortField(undefined);
    setSortOrder(undefined);
    setBottomSheetVisible(false);
  };

  // Доступные варианты сортировки
  const actions: SortAction[] = [
    {
      text: t("sort.sortByName"),
      key: "name",
      IconComponent: EditPencilIcon,
      iconSize: 22,
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

  return {
    activeSort,
    sortDirection,
    setActiveSort,
    setSortDirection,
    submitSort,
    actions,
    toggleSortDirection,
    handleReset,
  };
};
