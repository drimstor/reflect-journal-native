import { FC } from "react";
import { ImageBackground } from "react-native";
import { useThemeStore, useDeviceStore } from "@/src/shared/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "./ChatBackground.styles";

interface ChatBackgroundProps {
  withPattern?: boolean;
}

const ChatBackground: FC<ChatBackgroundProps> = ({ withPattern = true }) => {
  const { colors, theme } = useThemeStore();
  const { window, statusBarHeight } = useDeviceStore();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, window, insets, statusBarHeight);

  return (
    <ImageBackground
      source={
        withPattern
          ? theme === "light"
            ? require("@/assets/images/TopographicLight.png")
            : require("@/assets/images/TopographicDark.png")
          : require("@/assets/images/Transparent.png")
      }
      style={styles.background}
      resizeMode="cover"
    />
  );
};

export default ChatBackground;
