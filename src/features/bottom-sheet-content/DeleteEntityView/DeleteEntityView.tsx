import {
  Text,
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
} from "@/src/shared/ui";
import { useThemeStore, useBottomSheetStore } from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useDeleteAnyEntities } from "@/src/entities/common/lib/hooks/useDeleteAnyEntities";
import { useEffect } from "react";

const DeleteEntityView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { navigateToFlow, flowData } = useBottomSheetStore();

  const handleBack = () => {
    navigateToFlow("main", "actionsList");
  };

  const { deleteEntity, isLoading, isSuccess } = useDeleteAnyEntities(
    flowData.variant,
    flowData.id
  );

  useEffect(() => {
    if (isSuccess) navigateToFlow("main", "success");
  }, [isSuccess]);

  return (
    <BottomSheetBox style={{ gap: 4, paddingBottom: 60 }}>
      <BottomSheetHeader
        title={t("shared.confirmation.title")}
        onClose={handleBack}
        onBack={handleBack}
      />
      <PaddingLayout>
        <Text style={{ fontSize: 16 }} color={colors.contrast}>
          {t("shared.confirmation.deleteMessage")}
        </Text>
      </PaddingLayout>
      <BottomSheetFooter>
        <Button backgroundColor={colors.alternate} onPress={handleBack}>
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={deleteEntity}
          isLoading={isLoading}
        >
          {t("shared.actions.delete")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default DeleteEntityView;
