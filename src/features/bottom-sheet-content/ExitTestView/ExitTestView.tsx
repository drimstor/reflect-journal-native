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

  // useEffect(() => {
  //   if (isSuccess) {
  //     resetFilters();
  //     navigateToFlow("common", "success");
  //   }
  // }, [isSuccess]);

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
          onPress={() => {}}
          isLoading={false}
        >
          {t("shared.actions.logout")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default ExitTestView;
