import { useEffect, useRef } from "react";
import { useBottomSheetStore } from "@/src/shared/store";
import { Keyboard } from "react-native";
import { useBottomSheetIndexState } from "@/src/shared/lib/hooks";

export const useBottomSheetVisibility = () => {
  const { bottomSheetRef, snapToIndex, closeBottomSheet } =
    useBottomSheetIndexState();

  const isInitialRender = useRef(true);
  const { setBottomSheetVisible, isBottomSheetVisible, setBottomSheetHeight } =
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
