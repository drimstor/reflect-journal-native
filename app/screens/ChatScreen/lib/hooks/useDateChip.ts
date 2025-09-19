import { MessageGiftedChat } from "@/src/entities/chat/model/types";
import { useAnimate } from "@/src/shared/lib/hooks";
import { useCallback, useState } from "react";

interface UseDateChipReturn {
  currentDate: Date;
  chipAnimation: any;
  handleScroll: (event: any) => void;
}

export const useDateChip = (
  messages: MessageGiftedChat[]
): UseDateChipReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { animation: chipAnimation, animate: animateChip } = useAnimate();

  const handleScroll = useCallback(
    (event: any) => {
      const offset = event.nativeEvent.contentOffset.y;
      const visibleHeight = event.nativeEvent.layoutMeasurement.height;

      // Анимация чипсы на основе прогресса скролла
      if (offset < -30) {
        animateChip(0);
      } else if (offset <= 50) {
        const progress = Math.min(offset / 50, 1);
        animateChip(progress);
      } else {
        animateChip(1);
      }

      // Находим индекс сообщения, которое находится в центре экрана
      const centerY = offset + visibleHeight / 2;
      const messageHeight = 100;
      const visibleIndex = Math.floor(centerY / messageHeight);

      if (messages[visibleIndex]) {
        setCurrentDate(new Date(messages[visibleIndex].createdAt));
      }
    },
    [messages, chipAnimation]
  );

  return {
    currentDate,
    chipAnimation,
    handleScroll,
  };
};
