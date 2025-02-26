import { ImageBackground, StatusBar, View } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { useDeviceStore } from "@/src/shared/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackgroundLayout = ({ children }: { children: React.ReactNode }) => {
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
        <StatusBar backgroundColor={colors.background} />
        <View style={{ flex: 1, paddingTop: insets.top + statusBarHeight }}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

export default BackgroundLayout;
