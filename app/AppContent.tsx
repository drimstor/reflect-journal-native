import { useAppInit, useFonts } from "@/src/shared/lib/hooks";
import { useNotificationInit } from "@/src/shared/lib/hooks/useNotificationInit";
import { BackgroundLayout, UILayout } from "@/src/shared/ui";
import { View } from "react-native";
import Navigation from "./stacks/Navigation/Navigation";

const AppContent = () => {
  // const { prefetchJournals } = usePrefetch();
  const { onLayoutRootView, initialPath, appIsReady } = useAppInit();
  const fontsLoaded = useFonts();

  useNotificationInit();

  if (!appIsReady || !fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView}>
      <UILayout>
        <BackgroundLayout>
          <Navigation initialPath={initialPath} />
        </BackgroundLayout>
      </UILayout>
    </View>
  );
};

export default AppContent;
