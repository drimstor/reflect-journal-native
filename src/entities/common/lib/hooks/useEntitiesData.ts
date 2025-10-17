import { EntityType } from "@/src/shared/model/types";
import { useCarouselConfig } from "@/src/shared/ui";
import { useMemo, useState } from "react";
import { useGetAnyEntities } from "./useGetAnyEntities";

/**
 * Тип конфигурации карусели
 */
interface CarouselConfig {
  parallaxScrollingScale: number;
  parallaxScrollingOffset: number;
  parallaxAdjacentItemScale: number;
}

/**
 * Универсальный хук для получения и обработки данных сущностей для каруселей
 *
 * Хук предоставляет следующий функционал:
 * - Получает данные сущностей определенного типа (журналы, чаты и т.д.)
 * - Трансформирует данные для отображения в карусели
 * - Управляет состоянием выбранной сущности
 * - Предоставляет конфигурацию для карусели с эффектом параллакса
 *
 * @param entityType - Тип сущности (Journal, Chat, Goal, Summary)
 * @param params - Параметры пагинации и фильтрации
 * @returns Объект с данными сущностей, состоянием выбора и конфигурацией карусели
 */
export const useEntitiesData = ({
  entityType,
  params = "?page=1&limit=50",
  skip,
}: {
  entityType: EntityType;
  params?: string;
  skip?: boolean;
}) => {
  // Получение данных через универсальный хук
  const { data: entitiesData, isLoading } = useGetAnyEntities(
    entityType,
    params,
    skip
  );

  // Трансформация данных для карусели
  const entitiesDataTransformed = useMemo(() => {
    return entitiesData?.data?.map((item) => ({
      ...(item as any),
      description: "",
      entity_type: entityType,
      checklist: undefined,
    }));
  }, [entitiesData]);

  // Состояние выбранной сущности
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    (entitiesData?.data?.[0] as any)?.id || null
  );

  const entitiesConfig = useCarouselConfig(
    25,
    entitiesData?.data?.length && entitiesData?.data?.length > 1 ? 60 : 0
  );

  const entitiesCarouselConfig: CarouselConfig = {
    ...entitiesConfig,
    parallaxAdjacentItemScale: 0.79,
  };

  return {
    entitiesData,
    entitiesDataTransformed,
    selectedEntityId,
    setSelectedEntityId,
    entitiesCarouselConfig,
    isLoading,
  };
};
