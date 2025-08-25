export interface TooltipProps {
  text: string; // Текст для отображения в тултипе
  visible?: boolean; // Показывать ли тултип
  onPress?: () => void; // Колбэк при нажатии на тултип
  position?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}
