import { useEntitiesData } from "@/src/entities";
import { useRelateEntitiesMutation } from "@/src/entities/entities/api/entitiesApi";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
import { useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  Text,
  useCarouselConfig,
} from "@/src/shared/ui";
import { ItemCarousel } from "@/src/widgets";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SmallLoader } from "../../../shared/ui/Loader/SmallLoader";

// Массив доступных типов для связывания
const RELATION_TYPES: EntityType[] = [
  ENTITY_NAME.JOURNALS,
  ENTITY_NAME.CHATS,
  ENTITY_NAME.GOALS,
  ENTITY_NAME.SUMMARIES,
];

const CreateRelationView = () => {
  const t = useT();
  const {
    resetFlowData,
    setBottomSheetVisible,
    navigateToFlow,
    flowData,
    setNavigation,
  } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();

  // Получаем source данные из flowData
  const sourceType = flowData.variant as EntityType;
  const sourceId = flowData.id as string;

  // Состояние для выбора типа и сущности
  const [currentTypeIndex, setCurrentTypeIndex] = useState<number>(0);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  const currentType = RELATION_TYPES[currentTypeIndex];

  // Трансформируем типы для отображения в карусели
  const typesData = useMemo(() => {
    return RELATION_TYPES.map((type) => ({
      id: type,
      name: t(`entities.${type.toLowerCase()}.plural`),
      entity_type: type,
      created_at: new Date().toISOString(),
    }));
  }, [t]);

  // Конфигурация карусели для типов
  const entityCarouselConfig = useCarouselConfig(
    25,
    RELATION_TYPES.length > 1 ? 60 : 0
  );

  // Загружаем список сущностей выбранного типа
  const {
    entitiesDataTransformed,
    setSelectedEntityId: setEntityId,
    entitiesCarouselConfig,
    isLoading: isLoadingEntities,
  } = useEntitiesData({
    entityType: currentType,
    params: "?page=1&limit=50",
  });

  // Синхронизируем выбранную сущность
  useEffect(() => {
    if (entitiesDataTransformed && entitiesDataTransformed.length > 0) {
      setSelectedEntityId(entitiesDataTransformed[0].id);
      setEntityId(entitiesDataTransformed[0].id);
    } else {
      setSelectedEntityId(null);
    }
  }, [entitiesDataTransformed, setEntityId]);

  useEffect(() => {
    setNavigation(false, "");
  }, [setNavigation]);

  // Мутация для создания связи
  const [relateEntities, { isLoading: isCreating }] =
    useRelateEntitiesMutation();

  // Обработчик создания связи
  const handleCreate = async () => {
    if (!selectedEntityId || !sourceId || !sourceType) return;

    try {
      await relateEntities({
        source_type: sourceType,
        source_id: sourceId,
        target_type: currentType,
        target_id: selectedEntityId,
      }).unwrap();

      // Переход на экран успеха
      navigateToFlow("common", "success");
    } catch (error) {
      console.error("Ошибка при создании связи:", error);
    }
  };

  // Обработчик закрытия
  const handleClose = () => {
    resetFlowData();
    requestAnimationFrame(() => {
      setBottomSheetVisible(false);
    });
  };

  // Обработчик возврата
  const handleBack = () => {
    navigateToFlow("common", "list");
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        isBorderGap={false}
        title={t("relatedEntries.createTitle")}
        onClose={handleClose}
        onBack={handleBack}
      />
      <View style={{ paddingTop: 16 }}>
        {/* Карусель выбора типа сущности */}
        <ItemCarousel
          title={t("relatedEntries.selectType")}
          data={typesData}
          onSelectItem={setCurrentTypeIndex}
          activeIndex={currentTypeIndex}
          modeConfig={{
            ...entityCarouselConfig,
            parallaxAdjacentItemScale: 0.79,
          }}
          colors={colors}
          willCreate={true}
        />

        <View style={{ position: "relative", minHeight: 188, marginTop: 10 }}>
          <SmallLoader
            isVisible={isLoadingEntities}
            color={colors.accent}
            style={{
              position: "absolute",
              top: 75,
              left: "50%",
              marginLeft: -25,
              zIndex: 9,
            }}
          />
          {/* Карусель выбора конкретной сущности */}
          {!!entitiesDataTransformed?.length ? (
            <ItemCarousel
              title={t("relatedEntries.selectEntity")}
              data={entitiesDataTransformed}
              onSelectItem={(index) => {
                if (entitiesDataTransformed && entitiesDataTransformed[index]) {
                  const entityId = entitiesDataTransformed[index].id;
                  setSelectedEntityId(entityId);
                  setEntityId(entityId);
                }
              }}
              modeConfig={entitiesCarouselConfig}
              colors={colors}
            />
          ) : (
            !isLoadingEntities && (
              <View style={{ paddingTop: 75, alignItems: "center" }}>
                <Text size="large" font="bold" color={colors.contrast}>
                  {t("shared.noData.title")}
                </Text>
              </View>
            )
          )}
        </View>
      </View>
      <BottomSheetFooter>
        <Button
          onPress={handleCreate}
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          textColor={theme === "dark" ? colors.primary : colors.white}
          isLoading={isCreating}
          disabled={
            isCreating ||
            (!isLoadingEntities && !entitiesDataTransformed?.length)
          }
        >
          {t("relatedEntries.create")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default CreateRelationView;
