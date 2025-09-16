import { useBottomSheetIndexState } from "@/src/shared/lib/hooks";
import { useBottomSheetStore } from "@/src/shared/store";
import { useEffect, useRef } from "react";
import { Keyboard } from "react-native";

export const useBottomSheetVisibility = () => {
  const { bottomSheetRef, snapToIndex, closeBottomSheet } =
    useBottomSheetIndexState();

  const isInitialRender = useRef(true);
  const { setBottomSheetVisible, isBottomSheetVisible, resetFlow } =
    useBottomSheetStore();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isBottomSheetVisible) {
      snapToIndex(0);
    } else {
      closeBottomSheet();
    }
  }, [isBottomSheetVisible]);

  const handleClose = () => {
    Keyboard.dismiss();
    setBottomSheetVisible(false);
  };

  return { handleClose, bottomSheetRef, snapToIndex };
};
