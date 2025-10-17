import { useUnrelateEntitiesMutation } from "@/src/entities/entities/api/entitiesApi";
import { useT } from "@/src/shared/lib/hooks";
import { EntityType } from "@/src/shared/model/types";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  PaddingLayout,
  Text,
  useCarouselConfig,
} from "@/src/shared/ui";
import { ItemCarousel } from "@/src/widgets";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const DeleteRelationView = () => {
  const t = useT();
  const { resetFlowData, setBottomSheetVisible, navigateToFlow, flowData } =
    useBottomSheetStore();
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();

  const { setNavigation } = useBottomSheetStore();

  // Получаем source данные из flowData
  const sourceType = flowData.variant as EntityType;
  const sourceId = flowData.id as string;
  const relatedEntities = flowData.related_entities || [];

  // Состояние для выбранной сущности
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    relatedEntities[0]?.id || null
  );

  // Конфигурация карусели
  const carouselConfig = useCarouselConfig(
    25,
    relatedEntities.length > 1 ? 60 : 0
  );

  useEffect(() => {
    setNavigation(false, "");
  }, [setNavigation]);

  // Трансформируем related_entities для отображения в карусели
  const entitiesData = useMemo(() => {
    return relatedEntities.map((entity: any) => ({
      ...entity,
      description: "",
    }));
  }, [relatedEntities]);

  // Мутация для удаления связи
  const [unrelateEntities, { isLoading: isDeleting }] =
    useUnrelateEntitiesMutation();

  // Обработчик удаления связи
  const handleDelete = async () => {
    if (!selectedEntityId || !sourceId || !sourceType) return;

    // Находим выбранную сущность
    const selectedEntity = relatedEntities.find(
      (entity: any) => entity.id === selectedEntityId
    );

    if (!selectedEntity) return;

    try {
      await unrelateEntities({
        source_type: sourceType,
        source_id: sourceId,
        target_type: selectedEntity.entity_type,
        target_id: selectedEntityId,
      }).unwrap();

      // Переход на экран успеха
      navigateToFlow("common", "success");
    } catch (error) {
      console.error("Ошибка при удалении связи:", error);
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
        title={t("relatedEntries.deleteTitle")}
        onClose={handleClose}
        onBack={handleBack}
      />

      <View style={{ paddingTop: 16 }}>
        {!!entitiesData?.length ? (
          <ItemCarousel
            title={t("relatedEntries.selectEntity")}
            data={entitiesData}
            onSelectItem={(index) => {
              if (entitiesData && entitiesData[index]) {
                setSelectedEntityId(entitiesData[index].id);
              }
            }}
            modeConfig={{
              ...carouselConfig,
              parallaxAdjacentItemScale: 0.79,
            }}
            colors={colors}
          />
        ) : (
          <PaddingLayout>
            <Text
              size="base"
              color={colors.contrast}
              font="bold"
              style={{ marginVertical: 20, textAlign: "center" }}
            >
              {t("shared.noData.title")}
            </Text>
          </PaddingLayout>
        )}
      </View>
      <BottomSheetFooter>
        <Button
          onPress={handleDelete}
          backgroundColor={colors.error}
          textColor={colors.white}
          isLoading={isDeleting}
          disabled={!selectedEntityId || isDeleting || !entitiesData?.length}
        >
          {t("relatedEntries.delete")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default DeleteRelationView;
