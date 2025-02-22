import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PATHS } from "@/src/shared/const";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import screensData from "./const/screensData";
import { MainStack } from "./stacks/MainStack/MainStack";
import { ImageBackground, StatusBar, View } from "react-native";
import { useThemeStore } from "@/src/shared/store";
import { useDeviceStore } from "@/src/shared/store";
import { navTheme } from "./const/navTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalProvider } from "@gorhom/portal";
const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { colors, theme } = useThemeStore();
  const { statusBarHeight, window } = useDeviceStore();
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView>
      <PortalProvider>
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
              <NavigationContainer theme={navTheme}>
                <Stack.Navigator
                  initialRouteName={PATHS.MAIN_STACK}
                  screenOptions={{ headerShown: false }}
                >
                  <Stack.Screen name={PATHS.MAIN_STACK} component={MainStack} />
                  {screensData?.map(({ name, component, options }) => (
                    <Stack.Screen
                      options={options as NativeStackNavigationOptions}
                      key={name}
                      name={name}
                      component={component}
                    />
                  ))}
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </ImageBackground>
        </View>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

export default AppContent;
