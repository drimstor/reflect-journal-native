import { useKeyboard, useTimingAnimation } from "@/src/shared/lib/hooks";
import { useDeviceStore } from "@/src/shared/store";
import { ViewStyle } from "react-native";

export const useChatAnimation = () => {
  const { isAndroid, window } = useDeviceStore();
  const { isKeyboardVisible } = useKeyboard();
  const { animation } = useTimingAnimation(isKeyboardVisible, {
    duration: 700,
  });

  // Стили для контейнера чата
  const containerStyle: ViewStyle = {
    flex: 1,
    marginBottom: isAndroid ? -55 : isKeyboardVisible ? -28 : -55,
  };

  // Стили для анимированного контейнера пустого чата
  const getEmptyViewStyle = () => ({
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [window.height / 2, window.height / 4],
    }),
    transform: [
      { translateX: "-50%" as any },
      { translateY: "-50%" as any },
      { scaleY: -1 },
    ],
    position: "absolute" as ViewStyle["position"],
    left: window.width / 2,
    right: window.width / 2,
    width: window.width - 100,
    borderRadius: 25,
    borderWidth: 1,
    paddingBottom: 10,
    overflow: "hidden" as ViewStyle["overflow"],
  });

  // Стили для лоадера
  const getLoaderStyle = (): ViewStyle => ({
    transform: [
      { translateX: "-50%" as any },
      { translateY: "-50%" as any },
      { scaleY: -1 },
    ],
    position: "absolute",
    top: window.height / 3.3,
    left: window.width / 2,
    right: window.width / 2,
  });

  return {
    isKeyboardVisible,
    animation,
    containerStyle,
    getEmptyViewStyle,
    getLoaderStyle,
    window,
  };
};
