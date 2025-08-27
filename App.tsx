import { store } from "@/src/shared/store/store";
import { PortalProvider } from "@gorhom/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider } from "react-native-outside-press";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import AppContent from "./app/AppContent";

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
