import { ImageBackground, View } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { useDeviceStore } from "@/src/shared/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatusBarManager from "../StatusBar/StatusBarManager";

interface BackgroundLayoutProps {
  children: React.ReactNode;
  hideStatusBarIcons?: boolean;
}

const BackgroundLayout = ({ children }: BackgroundLayoutProps) => {
  const { colors, theme } = useThemeStore();
  const { statusBarHeight, window } = useDeviceStore();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        height: "100%",
      }}
    >
      <ImageBackground
        source={
          true
            ? theme === "light"
              ? require("@/assets/images/TopographicLight.png")
              : require("@/assets/images/TopographicDark.png")
            : require("@/assets/images/Transparent.png")
        }
        style={{ flex: 1, height: window.height + 20 }}
        resizeMode="cover"
      >
        <StatusBarManager
          backgroundColor={colors.background}
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
