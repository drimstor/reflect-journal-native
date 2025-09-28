import { AnimatedAppearance, SuccessWithHaptic } from "@/src/shared/ui";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { SuccessOverlayProps } from "./SuccessOverlay.types";

/**
 * Компонент для отображения оверлея с анимацией успешного завершения
 */
export const SuccessOverlay = ({
  isWelcomeVisible,
  isSuccessVisible,
}: SuccessOverlayProps) => {
  return (
    <AnimatedAppearance
      isVisible={isWelcomeVisible}
      style={{
        position: "absolute",
        top: (WINDOW_HEIGHT - 280) / 2,
        left: (WINDOW_WIDTH - 250) / 2,
        zIndex: 9,
      }}
    >
      {isSuccessVisible && <SuccessWithHaptic />}
    </AnimatedAppearance>
  );
};
