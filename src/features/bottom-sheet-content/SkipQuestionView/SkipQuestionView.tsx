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

const SkipQuestionView = () => {
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
          {t("shared.confirmation.skipQuestion")}
        </Text>
      </PaddingLayout>
      <BottomSheetFooter>
        <Button backgroundColor={colors.alternate} onPress={handleBack}>
          {t("shared.actions.cancel")}
        </Button>
        <Button
          backgroundColor={colors.error}
          textColor={colors.white}
          onPress={handleBack}
          isLoading={false}
        >
          {t("shared.actions.skip")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default SkipQuestionView;
