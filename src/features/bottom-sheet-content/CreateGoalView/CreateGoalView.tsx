import {
  getEntitiesIds,
  useGenerateGoalMutation,
  usePredictGoalMutation,
  useRelateEntitiesMutation,
  useSaveGoalMutation,
} from "@/src/entities";
import { Goal, SaveGoalRequest } from "@/src/entities/goals/model/types";
import { PATHS } from "@/src/shared/const";
import {
  ENTITY_NAME,
  ENTITY_WITH_PARENT,
  ENTITY_WITH_PARENT_CONFIG,
} from "@/src/shared/const/ENTITIES";
import { useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetScrollView,
  Button,
  Loader,
  PaddingLayout,
} from "@/src/shared/ui";
import { FormField } from "@/src/widgets";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useEditForm } from "./lib/hooks/useEditForm";
import { useEditFormConfig } from "./lib/hooks/useEditFormConfig";

interface CreateGoalViewProps {
  isBookmarked?: boolean;
  isStandalone?: boolean;
  navigationBack?: () => void;
}

const CreateGoalView = ({
  isBookmarked = false,
  isStandalone = false,
  navigationBack,
}: CreateGoalViewProps) => {
  const t = useT();
  const {
    flowData,
    resetFlowData,
    setBottomSheetVisible,
    setNavigation,
    setFlowData,
  } = useBottomSheetStore();
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();

  const [predictGoal, { isLoading: isPredicting }] = usePredictGoalMutation();
  const [generateGoal, { isLoading: isGenerating }] = useGenerateGoalMutation();
  const [saveGoal, { isLoading: isSaving }] = useSaveGoalMutation();

  const [goal, setGoal] = useState<Goal | undefined>(undefined);

  const [relateEntities, { isLoading: isRelatingEntities }] =
    useRelateEntitiesMutation();

  useEffect(() => {
    if (!isStandalone && flowData.requestAssistantMessage) {
      predictGoal(flowData.requestAssistantMessage)
        .unwrap()
        .then((data) => {
          setFlowData({ requestAssistantMessage: null });
          setGoal(data);
        });
    }
  }, [flowData.requestAssistantMessage, isStandalone]);

  // Получаем конфигурацию формы в зависимости от типа сущности
  const formConfig = useEditFormConfig(goal);

  // Инициализируем форму с начальными значениями из конфигурации
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    handleSecondarySubmit,
    resetForm,
  } = useEditForm(
    formConfig,
    async (formData) => {
      try {
        const saveData = isStandalone
          ? ({ ...formData, bookmarked: isBookmarked } as SaveGoalRequest)
          : (formData as SaveGoalRequest);

        const result = await saveGoal(saveData).unwrap();

        if (isStandalone) {
          navigationBack?.();

          setTimeout(() => {
            const params = { item: result, variant: ENTITY_NAME.GOALS };
            setNavigation(true, PATHS.LIBRARY_ITEM, params);
          }, 200);
        } else if (flowData.requestAssistantMessageStore) {
          relateEntities({
            source_type: ENTITY_WITH_PARENT.includes(
              flowData.requestAssistantMessageStore.source_type
            )
              ? ENTITY_WITH_PARENT_CONFIG[
                  flowData.requestAssistantMessageStore.source_type
                ]
              : flowData.requestAssistantMessageStore.source_type,
            source_id: ENTITY_WITH_PARENT.includes(
              flowData.requestAssistantMessageStore.source_type
            )
              ? getEntitiesIds(
                  flowData.requestAssistantMessageStore.source_id
                )[0]
              : flowData.requestAssistantMessageStore.source_id,
            target_type: ENTITY_NAME.GOALS,
            target_id: result.id,
          })
            .unwrap()
            .then(() => {
              handleBack();
              resetFlowData();
              setTimeout(() => {
                const params = { item: result, variant: ENTITY_NAME.GOALS };
                setNavigation(true, PATHS.LIBRARY_ITEM, params);
              }, 200);
            });
        }
      } catch (error) {
        console.error("Ошибка при сохранении цели:", error);
      }
    },
    async (formData) => {
      try {
        const result = await generateGoal({
          name: formData.name,
          additional_info: formData.additional_info,
          related_topics: formData.related_topics,
        }).unwrap();

        // Обновляем форму с новыми задачами
        setGoal(result);
      } catch (error) {
        console.error("Ошибка при генерации задач:", error);
      }
    }
  );

  // Эффект для сброса формы при изменении конфигурации
  useEffect(() => {
    resetForm();
  }, [formConfig, resetForm]);

  // Обработчик возврата
  const handleBack = () => {
    if (!isStandalone) {
      resetFlowData();
      setTimeout(() => {
        setBottomSheetVisible(false);
      }, 100);
    }
  };

  const isDisabled =
    isGenerating || isSaving || (!isStandalone && isRelatingEntities);

  const renderContent = () => (
    <PaddingLayout style={{ gap: 12 }}>
      {formConfig.fields.map((field) => (
        <FormField
          key={field.key}
          field={field}
          value={values[field.key]}
          error={errors[field.key]}
          onChange={handleChange}
        />
      ))}
    </PaddingLayout>
  );

  const renderFooter = () => (
    <BottomSheetFooter isBorderGap={isStandalone}>
      <Button
        backgroundColor={colors.alternate}
        onPress={handleSecondarySubmit}
        disabled={isDisabled}
        isLoading={isGenerating}
      >
        {t("edit.goals.generateNewTasks")}
      </Button>
      <Button
        backgroundColor={theme === "dark" ? colors.accent : colors.primary}
        textColor={theme === "dark" ? colors.primary : colors.white}
        onPress={handleSubmit}
        disabled={isDisabled}
        isLoading={isSaving || (!isStandalone && isRelatingEntities)}
      >
        {t("shared.actions.save")}
      </Button>
    </BottomSheetFooter>
  );

  // Для автономного режима (как в CreateEntityGoal)
  if (isStandalone) {
    return (
      <>
        {renderContent()}
        {renderFooter()}
      </>
    );
  }

  // Для режима BottomSheet (как в оригинальном CreateGoalView)
  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("goals.create")}
        onClose={handleBack}
        isBorderGap={false}
      />
      {isPredicting ? (
        <Loader
          style={{ marginTop: 100, marginBottom: 303 }}
          size={window.width - 100}
        />
      ) : (
        <>
          <BottomSheetScrollView
            customMaxHeight={window.height - 350}
            additionalHeight={305}
          >
            <View style={{ paddingVertical: 16, paddingBottom: 24 }}>
              {renderContent()}
            </View>
          </BottomSheetScrollView>
          {renderFooter()}
        </>
      )}
    </BottomSheetBox>
  );
};

export default CreateGoalView;
