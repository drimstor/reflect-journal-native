import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { PATHS } from "@/src/shared/const";
import { NavigationProps } from "@/src/shared/model/types";
import { useFiltersStore } from "@/src/shared/store";
import { Chat, Journal } from "@/src/entities";
import { LIBRARY_ITEMS } from "../../const/static";
import { EntityType } from "@/src/shared/model/types";

export const useLibraryScreenLogic = ({
  snapToIndex,
  bottomSheetIndex,
}: {
  snapToIndex: (index: number) => void;
  bottomSheetIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<NavigationProps>();
  const { resetFilters } = useFiltersStore();

  // Обработка выбора элемента в списке
  const onOpenListItem = (item: Journal | Chat) => {
    const variant = LIBRARY_ITEMS[currentIndex].id as EntityType;
    const params = { variant, item };

    // Для чатов сразу переходим на экран чата
    if (currentIndex === 1) {
      return navigation.navigate(PATHS.CHAT, params);
    }

    // Для остальных элементов - логика навигации в зависимости от типа
    const navigateToNextScreen = () => {
      resetFilters();

      if (bottomSheetIndex === 1) {
        if (currentIndex === 0) {
          return navigation.navigate(PATHS.LIBRARY_LIST, params);
        } else {
          return navigation.navigate(PATHS.LIBRARY_ITEM, params);
        }
      }

      snapToIndex(1);
      setTimeout(() => {
        if (currentIndex === 0) {
          return navigation.navigate(PATHS.LIBRARY_LIST, params);
        } else {
          navigation.navigate(PATHS.LIBRARY_ITEM, params);
        }
      }, 250);
    };

    return navigateToNextScreen();
  };

  // Обработчик изменения индекса карусели
  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
    resetFilters();
  };

  return {
    currentIndex,
    setCurrentIndex: handleIndexChange,
    onOpenListItem,
  };
};
