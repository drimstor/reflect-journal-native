import { useFiltersStore } from "@/src/shared/store";
import { useCallback } from "react";

interface UseMultiSelectionProps {
  itemId?: string;
  onPress: () => void;
}

export const useMultiSelection = ({
  itemId,
  onPress,
}: UseMultiSelectionProps) => {
  const filters = useFiltersStore();
  const selectionMode = filters.multi_select;
  const multiSelectIds = filters.multi_select_ids;
  const isSelected = itemId ? multiSelectIds?.includes(itemId) : false;

  const handleItemPress = useCallback(() => {
    if (selectionMode && itemId) {
      filters.setMultiSelectIds(
        isSelected
          ? (multiSelectIds || []).filter((id) => id !== itemId)
          : [...(multiSelectIds || []), itemId]
      );
    } else {
      onPress();
    }
  }, [selectionMode, itemId, isSelected, multiSelectIds, onPress]);

  return {
    selectionMode,
    multiSelectIds,
    isSelected,
    handleItemPress,
  };
};
