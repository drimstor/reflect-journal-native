import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { FC } from "react";
import { ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyles } from "./ChatBackground.styles";

interface ChatBackgroundProps {
  withPattern?: boolean;
}

const ChatBackground: FC<ChatBackgroundProps> = ({ withPattern = true }) => {
  const { theme } = useThemeStore();
  const { window, statusBarHeight } = useDeviceStore();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, window, insets, statusBarHeight);

  return (
    <ImageBackground
      source={
        withPattern
          ? theme === "light"
            ? require("@/assets/images/light.png")
            : require("@/assets/images/dark.png")
          : require("@/assets/images/Transparent.png")
      }
      style={styles.background}
      resizeMode="cover"
    />
  );
};

export default ChatBackground;
