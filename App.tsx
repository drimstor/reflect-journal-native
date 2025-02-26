import AppContent from "@/app/AppContent";
import { EventProvider } from "react-native-outside-press";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { Provider } from "react-redux";
import { store } from "@/src/shared/store/store";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <EventProvider>
            <PortalProvider>
              <AppContent />
            </PortalProvider>
          </EventProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}
