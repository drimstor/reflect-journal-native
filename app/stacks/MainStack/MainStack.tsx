import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PATHS } from "@/src/shared/const";
import { IconButton } from "@/src/shared/ui";
import {
  SettingsScreen,
  HomeScreen,
  LibraryScreen,
  CreateEntityScreen,
  OverviewScreen,
} from "@/app/screens";
import { View } from "react-native";
import { createStyles } from "./MainStack.styles";
import {
  HomeIcon,
  PlusIcon,
  ChartSolidIcon,
  DirectSolidIcon,
} from "@/src/shared/ui/icons";
import { useThemeStore, useDeviceStore } from "@/src/shared/store";
import * as Haptics from "expo-haptics";
import { useTabBarAnimation } from "./lib/hooks/useTabBarAnimation";
import { SettingsSolidIcon } from "@/src/shared/ui/icons";

const BottomTabs = createBottomTabNavigator();

export const MainStack = () => {
  const { colors, theme } = useThemeStore();
  const { isTablet, isAndroid } = useDeviceStore();
  const { animation } = useTabBarAnimation();
  const styles = createStyles(colors, theme, isTablet, isAndroid, animation);

  const transparentAlternate =
    theme === "dark" ? colors.alternate : colors.alternate + 80;

  return (
    <BottomTabs.Navigator
      initialRouteName={PATHS.LIBRARY}
      screenOptions={{
        ...styles,
        headerShown: false,
        tabBarShowLabel: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        },
      }}
    >
      <BottomTabs.Screen
        name={PATHS.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <HomeIcon
                size={28}
                color={focused ? colors.accent : transparentAlternate}
              />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.LIBRARY}
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.leftIconBox}>
                <DirectSolidIcon
                  size={28}
                  color={focused ? colors.accent : transparentAlternate}
                />
              </View>
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.MOCK}
        component={CreateEntityScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(PATHS.ADD_ENTRY);
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <IconButton style={styles.plusIconBox} onPress={() => {}}>
                <PlusIcon size={36} color={colors.black} />
              </IconButton>
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.OVERVIEW}
        component={OverviewScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.rightIconBox}>
                <ChartSolidIcon
                  size={29}
                  color={focused ? colors.accent : transparentAlternate}
                />
              </View>
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.PROFILE}
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <SettingsSolidIcon
                size={29}
                color={focused ? colors.accent : transparentAlternate}
              />
            );
          },
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default MainStack;
