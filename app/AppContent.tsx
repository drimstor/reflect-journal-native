import { useAppInit, useFonts, usePrefetch } from "@/src/shared/lib/hooks";
import { BackgroundLayout, UILayout } from "@/src/shared/ui";
import { View } from "react-native";

const AppContent = () => {
  usePrefetch();
  const { onLayoutRootView, initialPath, appIsReady } = useAppInit();
  const fontsLoaded = useFonts();
  if (!appIsReady || !fontsLoaded) return null;

  return (
    <View onLayout={onLayoutRootView}>
      <UILayout>
        <BackgroundLayout>
          <></>
          {/* <Navigation initialPath={initialPath} /> */}
        </BackgroundLayout>
      </UILayout>
    </View>
  );
};

export default AppContent;
