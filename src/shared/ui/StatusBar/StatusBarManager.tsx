import React, { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import { useStatusBarStore } from "../../store";

interface StatusBarManagerProps {
  /**
   * Скрыть строку состояния полностью
   */
  hidden?: boolean;
  /**
   * Стиль строки состояния
   * - 'default' - темные иконки на светлом фоне (iOS) или светлые иконки на темном фоне (Android)
   * - 'light-content' - светлые иконки на темном фоне
   * - 'dark-content' - темные иконки на светлом фоне
   */
  barStyle?: "default" | "light-content" | "dark-content";
  /**
   * Цвет фона строки состояния (только для Android)
   */
  backgroundColor?: string;
  /**
   * Скрыть значки сети, Wi-Fi и другие элементы строки состояния (только для iOS)
   */
  hideNetworkActivityIndicator?: boolean;
  /**
   * Анимировать изменения
   */
  animated?: boolean;
}

/**
 * Компонент для управления видимостью и стилем строки состояния
 */
const StatusBarManager: React.FC<StatusBarManagerProps> = ({
  barStyle = "default",
  backgroundColor = "transparent",
  hideNetworkActivityIndicator = false,
  animated = true,
}) => {
  const { isVisible } = useStatusBarStore();

  // На iOS можно скрыть индикатор активности сети
  if (Platform.OS === "ios" && hideNetworkActivityIndicator) {
    StatusBar.setNetworkActivityIndicatorVisible(!hideNetworkActivityIndicator);
  }

  return (
    <StatusBar
      hidden={!isVisible}
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      animated={animated}
      // Для iOS можно использовать дополнительные свойства
      networkActivityIndicatorVisible={
        Platform.OS === "ios" ? !hideNetworkActivityIndicator : undefined
      }
      // Для Android можно использовать translucent для прозрачного фона
      translucent={
        Platform.OS === "android" && backgroundColor === "transparent"
      }
    />
  );
};

export default StatusBarManager;
