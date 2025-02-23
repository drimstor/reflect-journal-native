import { useEffect, useRef } from "react";
import { useChatStore } from "@/src/shared/store";
import type { BottomSheetRef } from "@/src/shared/ui";

export const useBottomSheetVisibility = () => {
  const ref = useRef<BottomSheetRef>(null);
  const isInitialRender = useRef(true);
  const { setBottomSheetVisible, isBottomSheetVisible } = useChatStore();

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isBottomSheetVisible) {
      ref.current?.snapToIndex(1);
    } else {
      ref.current?.close();
    }
  }, [isBottomSheetVisible]);

  const handleClose = () => {
    setBottomSheetVisible(false);
  };

  return { handleClose, ref };
};
