import { useT } from "@/src/shared/lib/hooks";
import { SettingsLayout } from "@/src/shared/ui";
import { NotificationsView } from "@/src/widgets";

const SettingsNotificationsScreen = () => {
  const t = useT();
  return (
    <SettingsLayout title={t("settings.notifications")}>
      <NotificationsView />
    </SettingsLayout>
  );
};

export default SettingsNotificationsScreen;
