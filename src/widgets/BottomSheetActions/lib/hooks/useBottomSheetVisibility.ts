import { useEffect, useRef, ForwardedRef } from "react";
import { useChatStore } from "@/src/shared/store";
import type { BottomSheetRef } from "@/src/shared/ui";

export const useBottomSheetVisibility = (ref: ForwardedRef<BottomSheetRef>) => {
  const isInitialRender = useRef(true);
  const { setBottomSheetVisible, isBottomSheetVisible } = useChatStore();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!isBottomSheetVisible) {
      if (typeof ref === "object" && ref?.current) ref.current.close();
    }
  }, [isBottomSheetVisible]);

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  return {
    isBottomSheetVisible,
    handleClose,
  };
};
