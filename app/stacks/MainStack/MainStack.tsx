import {
  CreateEntityScreen,
  HomeScreen,
  LibraryScreen,
  OverviewScreen,
  SettingsScreen,
} from "@/app/screens";
import { PATHS } from "@/src/shared/const";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { IconButton } from "@/src/shared/ui";
import {
  ChartSolidIcon,
  DirectSolidIcon,
  HomeIcon,
  PlusIcon,
  SettingsSolidIcon,
} from "@/src/shared/ui/icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { View } from "react-native";
import { useTabBarAnimation } from "./lib/hooks/useTabBarAnimation";
import { createStyles } from "./MainStack.styles";

const BottomTabs = createBottomTabNavigator();

export const MainStack = () => {
  const { colors, theme } = useThemeStore();
  const { isTablet, isAndroid } = useDeviceStore();
  const { animation, isItemActive } = useTabBarAnimation();
  const styles = createStyles(colors, theme, isTablet, isAndroid, animation);

  const transparentAlternate =
    theme === "dark" ? colors.alternate : `${colors.alternate}80`;

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
              <View>
                {isItemActive(PATHS.HOME) && <View style={styles.activeDot} />}
                <HomeIcon
                  size={28}
                  color={focused ? colors.accent : transparentAlternate}
                />
              </View>
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
                {isItemActive(PATHS.LIBRARY) && (
                  <View style={styles.activeDot} />
                )}
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
                {isItemActive(PATHS.OVERVIEW) && (
                  <View style={styles.activeDot} />
                )}
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
              <View>
                {isItemActive(PATHS.PROFILE) && (
                  <View style={styles.activeDot} />
                )}
                <SettingsSolidIcon
                  size={29}
                  color={focused ? colors.accent : transparentAlternate}
                />
              </View>
            );
          },
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default MainStack;
