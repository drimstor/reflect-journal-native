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
      const messageBottom = pageY + height;
      const sheetTop = window.height - BOTTOM_SHEET_HEIGHT;

      if (messageBottom > sheetTop) {
        offset = -(messageBottom - sheetTop);
        isNeedTranslate = true;
      }

      if (height < window.height && pageY < TOP_SCREEN_OFFSET) {
        offset = -(pageY - TOP_SCREEN_OFFSET);
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
