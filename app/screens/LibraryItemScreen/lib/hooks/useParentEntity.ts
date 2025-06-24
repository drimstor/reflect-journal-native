import { useGetAnyEntity } from "@/src/entities";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";

/**
 * Хук для получения родительской сущности для записей журнала и результатов тестов
 * @param variant - тип текущей сущности
 * @param item - текущий элемент
 * @returns объект с родительскими сущностями и состоянием загрузки
 */
export const useParentEntity = (variant: string, item: any) => {
  // Конфигурация для получения родительской сущности
  const PARENT_ENTITY_CONFIG = {
    [ENTITY_NAME.JOURNAL_ENTRIES]: {
      parentType: ENTITY_NAME.JOURNALS,
      parentIdField: "journal_id",
    },
    [ENTITY_NAME.TEST_RESULTS]: {
      parentType: ENTITY_NAME.TESTS,
      parentIdField: "test_id",
    },
  };

  const currentConfig = PARENT_ENTITY_CONFIG[variant];
  const shouldFetchParent = !!currentConfig;
  const parentEntityType = currentConfig?.parentType || ENTITY_NAME.JOURNALS;
  const parentEntityId = currentConfig
    ? item?.[currentConfig.parentIdField] || ""
    : "";

  const { data: parentEntity, isLoading } = useGetAnyEntity({
    type: parentEntityType as any,
    id: parentEntityId,
    skip: !shouldFetchParent || !parentEntityId,
  });

  const parentJournal =
    variant === ENTITY_NAME.JOURNAL_ENTRIES ? parentEntity : null;
  const parentTest = variant === ENTITY_NAME.TEST_RESULTS ? parentEntity : null;

  return {
    parentJournal,
    parentTest,
    isLoading,
  };
};
