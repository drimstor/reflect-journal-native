import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { PaddingLayout, SuccessWithHaptic } from "@/src/shared/ui";
import { BottomSheetBox } from "@/src/shared/ui/BottomSheetContent";

const SuccessView = () => {
  const { setBottomSheetVisible, setNavigation, navigation } =
    useBottomSheetStore();

  const handleFinish = () => {
    setBottomSheetVisible(false);

    setTimeout(() => {
      setNavigation(true, navigation.navigateToPath, navigation.navigateParams);
    }, 350);
  };

  return (
    <BottomSheetBox style={{ paddingBottom: 43 }}>
      <PaddingLayout>
        <SuccessWithHaptic onFinish={handleFinish} />
      </PaddingLayout>
    </BottomSheetBox>
  );
};

export default SuccessView;
