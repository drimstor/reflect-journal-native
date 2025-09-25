import { PATHS } from "@/src/shared/const";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import { MainStack } from "../MainStack/MainStack";
import { navTheme } from "./const/navTheme";
import { screensData } from "./const/screensData";
import { useNavigationHandler } from "./lib/hooks/useNavigationHandler";
const Stack = createNativeStackNavigator();

const Navigation = ({ initialPath }: { initialPath: string }) => {
  const { handleStateChange } = useNavigationHandler();

  return (
    <NavigationContainer theme={navTheme} onStateChange={handleStateChange}>
      <Stack.Navigator
        initialRouteName={initialPath}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={PATHS.MAIN_STACK}
          component={MainStack}
          options={{ animation: "none" }}
        />
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
  );
};

export default Navigation;
