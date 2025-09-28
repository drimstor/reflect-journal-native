import { SuccessAnimation } from "@/src/shared/ui";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { ViewStyle } from "react-native";

const SuccessWithHaptic = ({
  onFinish,
  style,
}: {
  onFinish?: () => void;
  style?: ViewStyle;
}) => {
  useEffect(() => {
    const hapticTimeout = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1700);

    const visibleTimeout = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => {
      clearTimeout(hapticTimeout);
      clearTimeout(visibleTimeout);
    };
  }, []);

  return <SuccessAnimation style={style} />;
};

export default SuccessWithHaptic;
