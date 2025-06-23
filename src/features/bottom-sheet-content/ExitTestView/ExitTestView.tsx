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

const ExitTestView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { navigateToFlow, flowData, setBottomSheetVisible } =
    useBottomSheetStore();
  const { resetFilters } = useFiltersStore();

  const handleBack = () => {
    setBottomSheetVisible(false);
  };

  const handleExit = () => {
    // Вызываем функцию выхода из теста, переданную через flowData
    if (flowData.onExit && typeof flowData.onExit === "function") {
      flowData.onExit();
    }
    setBottomSheetVisible(false);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("shared.confirmation.title")} />
      <PaddingLayout>
        <Text style={{ fontSize: 16 }} color={colors.contrast}>
          {t("shared.confirmation.exitTest")}
        </Text>
      </PaddingLayout>
      <BottomSheetFooter>
        <Button backgroundColor={colors.alternate} onPress={handleBack}>
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={handleExit}
          isLoading={false}
        >
          {t("shared.actions.exit")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default ExitTestView;
