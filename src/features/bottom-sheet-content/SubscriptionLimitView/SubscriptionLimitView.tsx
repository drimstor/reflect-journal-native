// import { styles } from './SubscriptionLimitView.styles';

import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import {
  BottomSheetBox,
  BottomSheetFooter,
  BottomSheetHeader,
  PaddingLayout,
} from "@/src/shared/ui";

const SubscriptionLimitView = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("sort.sortBy")} />
      <PaddingLayout>
        <></>
      </PaddingLayout>
      <BottomSheetFooter>
        <></>
        {/* <Button
          backgroundColor={colors.alternate}
          onPress={handleReset}
          disabled={isCleared}
        >
          {t("shared.actions.reset")}
        </Button>

        <Button
          backgroundColor={theme === "dark" ? colors.accent : colors.primary}
          onPress={submitSort}
          isLoading={false}
        >
          {t("shared.actions.apply")}
        </Button> */}
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default SubscriptionLimitView;
