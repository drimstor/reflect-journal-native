import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { ImageBackground, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatusBarManager from "../StatusBar/StatusBarManager";

interface BackgroundLayoutProps {
  children: React.ReactNode;
  hideStatusBarIcons?: boolean;
}

const BackgroundLayout = ({ children }: BackgroundLayoutProps) => {
  const { theme, isBackgroundImage } = useThemeStore();
  const { statusBarHeight, window } = useDeviceStore();
  const insets = useSafeAreaInsets();
  const backgroundColor = theme === "light" ? "#F1F2F3" : "#181822";

  return (
    <View
      style={{
        backgroundColor,
        height: "100%",
      }}
    >
      <ImageBackground
        source={
          isBackgroundImage
            ? theme === "light"
              ? require("@/assets/images/light.png")
              : require("@/assets/images/dark.png")
            : require("@/assets/images/Transparent.png")
        }
        style={{ flex: 1, height: window.height + 20 }}
        resizeMode="cover"
      >
        <StatusBarManager
          backgroundColor={backgroundColor}
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
        />
        <View style={{ flex: 1, paddingTop: insets.top + statusBarHeight }}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

export default BackgroundLayout;
