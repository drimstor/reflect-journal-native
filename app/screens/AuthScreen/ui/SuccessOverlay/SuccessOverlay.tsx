import { useThemeStore } from "@/src/shared/store";
import { AnimatedAppearance, SuccessWithHaptic } from "@/src/shared/ui";
import { createStyles } from "../../AuthScreen.styles";

export interface SuccessOverlayProps {
  isWelcomeVisible: boolean; // Видимость приветственного экрана
  isSuccessVisible: boolean; // Видимость индикатора успеха
}

/**
 * Компонент для отображения оверлея с анимацией успешного завершения
 */
export const SuccessOverlay = ({
  isWelcomeVisible,
  isSuccessVisible,
}: SuccessOverlayProps) => {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <AnimatedAppearance
      isVisible={isWelcomeVisible}
      style={styles.successOverlay}
    >
      {isSuccessVisible && <SuccessWithHaptic />}
    </AnimatedAppearance>
  );
};
