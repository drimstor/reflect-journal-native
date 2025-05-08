import { PaddingLayout, SuccessAnimation } from "@/src/shared/ui";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { BottomSheetBox } from "@/src/shared/ui/BottomSheetContent";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

const SuccessView = ({}) => {
  const { setBottomSheetVisible, setNavigation, navigation } =
    useBottomSheetStore();

  useEffect(() => {
    const hapticTimeout = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1700);

    const visibleTimeout = setTimeout(() => {
      setBottomSheetVisible(false);
    }, 2500);

    const navigateTimeout = setTimeout(() => {
      setNavigation(true, navigation.navigateToPath, navigation.navigateParams);
    }, 2850);

    return () => {
      clearTimeout(hapticTimeout);
      clearTimeout(visibleTimeout);
      clearTimeout(navigateTimeout);
    };
  }, []);

  return (
    <BottomSheetBox style={{ paddingBottom: 43 }}>
      <PaddingLayout>
        <SuccessAnimation />
      </PaddingLayout>
    </BottomSheetBox>
  );
};

export default SuccessView;
