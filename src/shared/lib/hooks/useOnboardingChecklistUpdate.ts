import { useCallback } from "react";
import { addSnackbar, useAppDispatch, useOnboardingStore } from "../../store";
import { useT } from "./useLang";

/**
 * Хук для управления обновлением чек-листов онбординга
 * Автоматически проверяет условия и отправляет снекбары
 */
export const useOnboardingChecklistUpdate = () => {
  const t = useT();
  const dispatch = useAppDispatch();
  const { isCompleted, checklists, updateChecklistItem, resetOnboarding } =
    useOnboardingStore();

  /**
   * Обновить пункт чек-листа если он еще не выполнен
   * @param stepIndex - Индекс шага (0-4)
   * @param itemId - ID пункта чек-листа
   */
  const updateChecklist = useCallback(
    (stepIndex: number, itemId: string) => {
      // Проверяем, что онбординг еще не завершен
      if (isCompleted) return;

      // Ищем пункт в чек-листе
      const checklistItem = checklists[stepIndex]?.find(
        (item) => item.id === itemId
      );

      // Обновляем только если пункт существует и еще не выполнен
      if (checklistItem && !checklistItem.completed) {
        updateChecklistItem(stepIndex, itemId);

        // Отправляем снекбар с похвалой
        dispatch(
          addSnackbar({
            text: t(`onboarding.snackbars.${itemId}`),
            type: "success",
          })
        );
      }
    },
    [isCompleted, checklists, updateChecklistItem, dispatch, t]
  );

  return { updateChecklist, isCompleted };
};
