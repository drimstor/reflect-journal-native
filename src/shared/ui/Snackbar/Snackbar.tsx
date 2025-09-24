import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { capitalizeText } from "../../lib/helpers";
import {
  removeSnackbar,
  useAppDispatch,
  useDeviceStore,
  useThemeStore,
} from "../../store";
import { SiriLoader } from "../Loader/SiriLoader";
import Text from "../Text/Text";
import { MAX_LENGTH_FOR_LARGE } from "./const/static";
import { useSnackbarAnimation } from "./lib/hooks/useSnackbarAnimation";
import { useSnackbarTimers } from "./lib/hooks/useSnackbarTimers";
import { createStyles } from "./Snackbar.styles";

export type SnackbarType = "success" | "error";

export interface ISnackbar {
  id: number;
  text: string;
  type: SnackbarType;
}

interface SnackbarProps {
  data: ISnackbar;
}

const Snackbar: FC<SnackbarProps> = ({ data }) => {
  const dispatch = useAppDispatch();
  const { statusBarHeight } = useDeviceStore();
  const { top } = useSafeAreaInsets();
  const { colors } = useThemeStore();
  const styles = createStyles(colors, top + statusBarHeight);
  const onClose = () => dispatch(removeSnackbar(data.id));
  const { panHandlers, animatedStyle, toggleVisible } = useSnackbarAnimation({
    onClose,
  });
  useSnackbarTimers({ onClose, toggleVisible });

  const colorConfig = {
    success: ["#4da3b06d", colors.secondary] as const,
    // error: [colors.error + 70, colors.error + 10] as const,
    error: ["#4da3b06d", colors.secondary] as const,
  };

  const getTextSize = (text: string) => {
    return text.length > MAX_LENGTH_FOR_LARGE ? "medium" : "large";
  };

  return (
    <Animated.View {...panHandlers} style={[styles.positionBox, animatedStyle]}>
      <LinearGradient
        colors={colorConfig[data.type]}
        start={{ x: -2, y: 4 }}
        end={{ x: 0.5, y: 1.9 }}
        style={[styles.container]}
      >
        <SiriLoader size={40} isVisible={true} />
        <Text
          size={getTextSize(data.text)}
          font="bold"
          style={styles.text}
          color={colors.contrast}
          numberOfLines={2}
        >
          {capitalizeText(data.text)}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default Snackbar;
