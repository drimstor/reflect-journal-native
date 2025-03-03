import { useState, RefObject, useRef } from "react";
import { View } from "react-native";
import { useDeviceStore } from "@/src/shared/store";
import {
  INITIAL_POSITION,
  BOTTOM_SHEET_HEIGHT,
  TOP_SCREEN_OFFSET,
} from "../../const/static";

export const useMessageMeasure = () => {
  const ref = useRef<View>(null);
  const { window } = useDeviceStore();
  const [bubbleLayout, setBubbleLayout] = useState(INITIAL_POSITION);

  const measureOffset = () => {
    let isNeedTranslate = false;
    let offset = 0;

    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      const messageBottomSide = pageY + height;
      const freeScreenHeight = window.height - BOTTOM_SHEET_HEIGHT;
      const isMessageHeightMoreThanScreen = height > freeScreenHeight;
      const isMessageUnderScreen = pageY < TOP_SCREEN_OFFSET;

      if (
        messageBottomSide > freeScreenHeight ||
        isMessageHeightMoreThanScreen
      ) {
        offset = -(messageBottomSide - freeScreenHeight);
        isNeedTranslate = true;
        return { isNeedTranslate, offset };
      }

      if (!isMessageHeightMoreThanScreen && isMessageUnderScreen) {
        const isPageYNegative = pageY < 0;

        const summ = isPageYNegative
          ? Math.abs(pageY) + TOP_SCREEN_OFFSET
          : TOP_SCREEN_OFFSET - pageY;

        const currentMessageMoreThanFreeScreen =
          TOP_SCREEN_OFFSET + height > freeScreenHeight;

        if (currentMessageMoreThanFreeScreen) {
          const difference = TOP_SCREEN_OFFSET + height - freeScreenHeight;
          offset = summ - difference;
        } else {
          offset = summ;
        }
        isNeedTranslate = true;
      }
    });

    return { isNeedTranslate, offset };
  };

  const setBubblePosition = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      setBubbleLayout({
        x: pageX,
        y: pageY,
        width,
        height,
      });
    });
  };

  const resetBubblePosition = () => {
    setBubbleLayout(INITIAL_POSITION);
  };

  return {
    bubbleLayout,
    measureOffset,
    setBubblePosition,
    resetBubblePosition,
    ref,
  };
};
