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
} from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { useState } from "react";
import { useLogOutWithNavigation } from "@/src/entities";
import { PATHS } from "@/src/shared/const";

const LogoutView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { setNavigation, setBottomSheetVisible } = useBottomSheetStore();
  const { resetFilters } = useFiltersStore();
  const logout = useLogOutWithNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    setBottomSheetVisible(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    resetFilters();
    setNavigation(true, PATHS.AUTH);
    setIsLoading(false);
    handleBack();
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("shared.confirmation.title")} />
      <PaddingLayout>
        <Text style={{ fontSize: 16 }} color={colors.contrast}>
          {t("shared.confirmation.logoutMessage")}
        </Text>
      </PaddingLayout>
      <BottomSheetFooter>
        <Button backgroundColor={colors.alternate} onPress={handleBack}>
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={handleLogout}
          isLoading={isLoading}
        >
          {t("shared.actions.logout")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default LogoutView;
