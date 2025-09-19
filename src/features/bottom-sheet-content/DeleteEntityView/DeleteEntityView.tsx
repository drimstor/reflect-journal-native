import { useDeleteAnyEntities } from "@/src/entities/common/lib/hooks/useDeleteAnyEntities";
import { useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useFiltersStore,
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
import { useEffect } from "react";

const DeleteEntityView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { navigateToFlow, flowData, setBottomSheetVisible } =
    useBottomSheetStore();
  const { resetFilters } = useFiltersStore();

  const handleBack = () => {
    navigateToFlow("common", "list");
  };

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  const { deleteEntity, isLoading, isSuccess } = useDeleteAnyEntities(
    flowData.variant,
    flowData.id
  );

  useEffect(() => {
    if (isSuccess) {
      resetFilters();
      navigateToFlow("common", "success");
    }
  }, [isSuccess]);

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("shared.confirmation.title")}
        onClose={handleClose}
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
