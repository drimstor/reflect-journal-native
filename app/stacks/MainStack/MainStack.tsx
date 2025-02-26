import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PATHS } from "@/src/shared/const";
import { IconButton } from "@/src/shared/ui";
import {
  ProfileScreen,
  HomeScreen,
  AuthScreen,
  LibraryScreen,
  ChatScreen,
} from "@/app/screens";
import { View } from "react-native";
import { createStyles } from "./MainStack.styles";
import {
  HomeIcon,
  DocumentSolidIcon,
  CalendarIcon,
  UserIcon,
  PlusIcon,
} from "@/src/shared/ui/icons";
import { useThemeStore, useDeviceStore } from "@/src/shared/store";
import * as Haptics from "expo-haptics";
import { useTabBarAnimation } from "./lib/hooks/useTabBarAnimation";

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
                <DocumentSolidIcon
                  size={28}
                  color={focused ? colors.accent : transparentAlternate}
                />
              </View>
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.NEW}
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <IconButton
                style={styles.plusIconBox}
                isOpacity
                onPress={() => {}}
              >
                <PlusIcon size={36} color={colors.black} />
              </IconButton>
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.MOCK}
        component={AuthScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.rightIconBox}>
                <CalendarIcon
                  size={28}
                  color={focused ? colors.accent : transparentAlternate}
                />
              </View>
            );
          },
        }}
      />
      <BottomTabs.Screen
        name={PATHS.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <UserIcon
                size={28}
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
