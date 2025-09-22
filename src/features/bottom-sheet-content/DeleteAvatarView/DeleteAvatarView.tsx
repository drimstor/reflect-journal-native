import { useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  Button,
  PaddingLayout,
  Text,
} from "@/src/shared/ui";
import { useEffect } from "react";
import { useDeleteAvatarManager } from "./lib/hooks/useDeleteAvatarManager";

const DeleteAvatarView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { navigateToFlow, setBottomSheetVisible } = useBottomSheetStore();

  const handleBack = () => {
    navigateToFlow("common", "list");
  };

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  const { handleDelete, isLoading, isSuccess } = useDeleteAvatarManager();

  useEffect(() => {
    if (isSuccess) {
      navigateToFlow("common", "success");
    }
  }, [isSuccess, navigateToFlow]);

  return (
    <BottomSheetBox>
      <BottomSheetHeader
        title={t("shared.confirmation.title")}
        onClose={handleClose}
        onBack={handleBack}
      />
      <PaddingLayout>
        <Text style={{ fontSize: 16 }} color={colors.contrast}>
          {t("shared.confirmation.deleteAvatarMessage")}
        </Text>
      </PaddingLayout>
      <BottomSheetFooter>
        <Button backgroundColor={colors.alternate} onPress={handleBack}>
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={handleDelete}
          isLoading={isLoading}
        >
          {t("shared.actions.delete")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default DeleteAvatarView;
