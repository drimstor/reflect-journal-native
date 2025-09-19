import { useBottomSheetIndexState } from "@/src/shared/lib/hooks";
import { useBottomSheetStore } from "@/src/shared/store";
import { useEffect, useRef } from "react";
import { Keyboard } from "react-native";

export const useBottomSheetVisibility = () => {
  const isInitialRender = useRef(true);
  const { setBottomSheetVisible, isBottomSheetVisible, resetFlow } =
    useBottomSheetStore();
  const { bottomSheetRef, snapToIndex, closeBottomSheet } =
    useBottomSheetIndexState();

  useEffect(() => {
    if (isInitialRender.current) {
      snapToIndex(0);
      requestAnimationFrame(closeBottomSheet);
      isInitialRender.current = false;
    }
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isBottomSheetVisible) {
      snapToIndex(0);
    } else {
      closeBottomSheet();
      setTimeout(resetFlow, 500);
    }
  }, [isBottomSheetVisible]);

  const handleClose = () => {
    Keyboard.dismiss();
    setBottomSheetVisible(false);
  };

  return { handleClose, bottomSheetRef, snapToIndex };
};
