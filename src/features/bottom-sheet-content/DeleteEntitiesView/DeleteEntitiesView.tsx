import {
  Text,
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
} from "@/src/shared/ui";
import {
  useThemeStore,
  useBottomSheetStore,
  useFiltersStore,
  useScreenInfoStore,
} from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useDeleteAnyEntities } from "@/src/entities/common/lib/hooks/useDeleteAnyEntities";
import { useEffect, useState, useCallback } from "react";
import { LibraryListVariant } from "@/src/shared/model/types";

const DeleteEntitiesView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { navigateToFlow } = useBottomSheetStore();
  const { multi_select_ids, setMultiSelectIds, setMultiSelect, resetFilters } =
    useFiltersStore();

  const { screenInfo } = useScreenInfoStore();
  const variant = screenInfo?.name as LibraryListVariant;

  // Состояние для отслеживания процесса удаления
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [totalToDelete, setTotalToDelete] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  // Получаем хук для удаления текущего элемента
  const { deleteEntity } = useDeleteAnyEntities(variant, currentId);

  const handleBack = () => {
    if (isDeleting) return; // Блокируем возврат во время удаления
    navigateToFlow("common", "list");
  };

  // Эффект для последовательного удаления элементов
  useEffect(() => {
    const deleteNext = async () => {
      if (!isDeleting || !multi_select_ids?.length) return;

      // Если все элементы удалены или произошла ошибка
      if (deletedCount >= totalToDelete || hasError) {
        setIsDeleting(false);
        return;
      }

      // Берем следующий ID для удаления
      const nextId = multi_select_ids[deletedCount];
      if (nextId) {
        setCurrentId(nextId);
      }
    };

    deleteNext();
  }, [isDeleting, deletedCount, totalToDelete, hasError, multi_select_ids]);

  // Эффект для обработки результата удаления текущего элемента
  useEffect(() => {
    const handleDeleteResult = async () => {
      if (!currentId || !isDeleting) return;

      try {
        await deleteEntity();
        setDeletedCount((prev) => prev + 1);
        setCurrentId(undefined);
      } catch (error) {
        console.error(`Ошибка при удалении элемента с ID ${currentId}:`, error);
        setHasError(true);
        setCurrentId(undefined);
      }
    };

    if (currentId) {
      handleDeleteResult();
    }
  }, [currentId, deleteEntity, isDeleting]);

  // Функция для запуска процесса удаления
  const handleDeleteAll = useCallback(() => {
    if (!multi_select_ids?.length) return;

    setIsDeleting(true);
    setTotalToDelete(multi_select_ids.length);
    setDeletedCount(0);
    setHasError(false);
    setCurrentId(undefined);
  }, [multi_select_ids]);

  // Переход к экрану успеха после завершения удаления
  useEffect(() => {
    if (isDeleting === false && deletedCount > 0) {
      // Очищаем выбранные элементы после удаления
      setMultiSelectIds([]);
      setMultiSelect(false);
      resetFilters();

      if (!hasError) {
        navigateToFlow("common", "success");
      }
    }
  }, [isDeleting, deletedCount, hasError, navigateToFlow, setMultiSelectIds]);

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("shared.confirmation.title")}
        onClose={handleBack}
        onBack={handleBack}
      />
      <PaddingLayout>
        <Text style={{ fontSize: 16 }} color={colors.contrast}>
          {(multi_select_ids?.length || 0) > 1
            ? `${t("shared.confirmation.deleteMultipleMessage")} (${
                multi_select_ids?.length || 0
              })`
            : t("shared.confirmation.deleteMessage")}
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
          disabled={isDeleting}
        >
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={handleDeleteAll}
          disabled={isDeleting || !multi_select_ids?.length}
        >
          {isDeleting
            ? `${t(
                "shared.status.loading"
              )}... ${deletedCount}/${totalToDelete}`
            : t("shared.actions.delete")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default DeleteEntitiesView;
