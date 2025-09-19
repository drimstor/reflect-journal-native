import { useEditAnyEntities } from "@/src/entities/common/lib/hooks/useEditAnyEntities";
import { useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useFiltersStore,
  useScreenInfoStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  PaddingLayout,
  Text,
} from "@/src/shared/ui";
import { useCallback, useEffect, useState } from "react";

const BookmarkedEntitiesView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { navigateToFlow, setNavigation, setBottomSheetVisible } =
    useBottomSheetStore();
  const { multi_select_ids, setMultiSelectIds, setMultiSelect } =
    useFiltersStore();

  const { screenInfo } = useScreenInfoStore();
  const variant = screenInfo?.name as EntityType;

  // Состояние для отслеживания процесса добавления в избранное
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  // Получаем хук для редактирования текущего элемента
  const { editEntity } = useEditAnyEntities(variant, currentId);

  const handleBack = () => {
    if (isProcessing) return; // Блокируем возврат во время обработки
    navigateToFlow("common", "list");
  };

  // Эффект для последовательной обработки элементов
  useEffect(() => {
    const processNext = async () => {
      if (!isProcessing || !multi_select_ids?.length) return;

      // Если все элементы обработаны или произошла ошибка
      if (processedCount >= totalToProcess || hasError) {
        // Очищаем выбранные элементы
        setMultiSelectIds([]);
        setMultiSelect(false);
        setNavigation(false, "");

        // Сразу переходим на следующий экран при успехе
        if (!hasError) {
          navigateToFlow("common", "success");
        }

        return;
      }

      // Берем следующий ID для обработки
      const nextId = multi_select_ids[processedCount];
      if (nextId) {
        setCurrentId(nextId);
      }
    };

    processNext();
  }, [
    isProcessing,
    processedCount,
    totalToProcess,
    hasError,
    multi_select_ids,
    navigateToFlow,
    setMultiSelectIds,
    setMultiSelect,
    setNavigation,
  ]);

  // Эффект для обработки результата добавления в избранное текущего элемента
  useEffect(() => {
    const handleEditResult = async () => {
      if (!currentId || !isProcessing) return;

      try {
        // Добавляем элемент в избранное
        await editEntity({ bookmarked: true });
        setProcessedCount((prev) => prev + 1);
        setCurrentId(undefined);
      } catch (error) {
        console.error(
          `Ошибка при добавлении в избранное элемента с ID ${currentId}:`,
          error
        );
        setHasError(true);
        setCurrentId(undefined);
      }
    };

    if (currentId) {
      handleEditResult();
    }
  }, [currentId, editEntity, isProcessing]);

  // Функция для запуска процесса добавления в избранное
  const handleAddToBookmarks = useCallback(() => {
    if (!multi_select_ids?.length) return;

    setIsProcessing(true);
    setTotalToProcess(multi_select_ids.length);
    setProcessedCount(0);
    setHasError(false);
    setCurrentId(undefined);
  }, [multi_select_ids]);

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("shared.actions.add")}
        onClose={handleClose}
        onBack={handleBack}
      />
      <PaddingLayout>
        <Text style={{ fontSize: 16 }} color={colors.contrast}>
          {(multi_select_ids?.length || 0) > 1
            ? `${t("shared.confirmation.addToBookmarkMultipleMessage")} (${
                multi_select_ids?.length || 0
              })`
            : t("shared.confirmation.addToBookmarkMessage")}
        </Text>
        {hasError && (
          <Text style={{ fontSize: 14, marginTop: 8 }} color={colors.error}>
            {t("shared.status.error")}
          </Text>
        )}
      </PaddingLayout>
      <BottomSheetFooter>
        <Button
          backgroundColor={colors.alternate}
          onPress={handleBack}
          disabled={isProcessing}
        >
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          onPress={handleAddToBookmarks}
          disabled={isProcessing || !multi_select_ids?.length}
        >
          {isProcessing
            ? `${t(
                "shared.status.loading"
              )}... ${processedCount}/${totalToProcess}`
            : t("shared.actions.add")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default BookmarkedEntitiesView;
